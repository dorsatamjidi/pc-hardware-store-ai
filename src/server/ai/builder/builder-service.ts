import { prisma } from "@/lib/prisma";
import { runCompatibilityEngine } from "@/server/compatibility/engine";
import type { Build, ComponentSlot } from "@/server/compatibility/types";

export interface BuilderIdentity {
  userId?: string;
  sessionToken?: string;
}

export class BuilderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function ownsBuild(build: { userId: string | null; builderSessionToken: string | null }, identity: BuilderIdentity) {
  if (identity.userId) return build.userId === identity.userId;
  if (identity.sessionToken) return build.builderSessionToken === identity.sessionToken;
  return false;
}

export async function getOrCreateBuild(identity: BuilderIdentity, buildId?: string) {
  if (buildId) {
    const existing = await prisma.savedBuild.findUnique({ where: { id: buildId } });
    if (!existing) throw new BuilderError("Build not found", 404);
    if (!ownsBuild(existing, identity)) throw new BuilderError("Build not found", 404);
    return existing;
  }

  return prisma.savedBuild.create({
    data: {
      name: "My Build",
      userId: identity.userId ?? null,
      builderSessionToken: identity.userId ? null : identity.sessionToken ?? null,
    },
  });
}

async function loadBuildFromItems(buildId: string): Promise<Build> {
  const items = await prisma.buildItem.findMany({
    where: { buildId },
    include: { product: { include: { compatibility: true, images: { where: { isPrimary: true }, take: 1 } } } },
  });

  const build: Build = {};
  for (const item of items) {
    build[item.productType as ComponentSlot] = { product: item.product, quantity: item.quantity };
  }
  return build;
}

async function syncSnapshot(buildId: string) {
  const build = await loadBuildFromItems(buildId);
  const report = runCompatibilityEngine(build);
  const savedBuild = await prisma.savedBuild.update({
    where: { id: buildId },
    data: { totalPrice: report.totalPrice, compatibilitySnapshot: JSON.parse(JSON.stringify(report)) },
  });
  return { savedBuild, build, report };
}

export async function addComponent(
  identity: BuilderIdentity,
  buildId: string | undefined,
  componentType: ComponentSlot,
  productId: string,
  quantity: number,
) {
  const savedBuild = await getOrCreateBuild(identity, buildId);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new BuilderError("Product not found", 404);
  if (product.type !== componentType) {
    throw new BuilderError(`${product.name} is a ${product.type}, not a ${componentType}`);
  }

  // One product per slot: replace any existing item of this type first.
  await prisma.buildItem.deleteMany({ where: { buildId: savedBuild.id, productType: componentType } });
  await prisma.buildItem.create({
    data: { buildId: savedBuild.id, productId, productType: componentType, quantity },
  });

  return syncSnapshot(savedBuild.id);
}

export async function removeComponent(identity: BuilderIdentity, buildId: string, componentType: ComponentSlot) {
  const savedBuild = await getOrCreateBuild(identity, buildId);
  await prisma.buildItem.deleteMany({ where: { buildId: savedBuild.id, productType: componentType } });
  return syncSnapshot(savedBuild.id);
}

export async function resetBuild(identity: BuilderIdentity, buildId: string) {
  const savedBuild = await getOrCreateBuild(identity, buildId);
  await prisma.buildItem.deleteMany({ where: { buildId: savedBuild.id } });
  return syncSnapshot(savedBuild.id);
}

export async function getBuildState(identity: BuilderIdentity, buildId: string) {
  const savedBuild = await getOrCreateBuild(identity, buildId);
  const build = await loadBuildFromItems(savedBuild.id);
  const report = runCompatibilityEngine(build);
  return { savedBuild, build, report };
}

/** Shapes the internal Build/report/SavedBuild trio into a JSON-safe API response payload. */
export function serializeBuildResult(
  result: { savedBuild: { id: string; name: string }; build: Build; report: ReturnType<typeof runCompatibilityEngine> },
  suggestion?: string | null,
) {
  const components = Object.entries(result.build).map(([slot, component]) => ({
    slot,
    product: component!.product,
    quantity: component!.quantity,
  }));

  return {
    buildId: result.savedBuild.id,
    name: result.savedBuild.name,
    components,
    report: result.report,
    ...(suggestion !== undefined ? { suggestion } : {}),
  };
}

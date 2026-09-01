import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function WorkspaceIndexPage({ params }: PageProps) {
  const { organizationId, workspaceId } = await params;
  redirect(`/org/${organizationId}/workspace/${workspaceId}/overview`);
}

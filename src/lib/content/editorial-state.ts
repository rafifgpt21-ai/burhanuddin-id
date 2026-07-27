export type EditorialStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EditorialTransition =
  | "publish"
  | "unpublish"
  | "archive"
  | "restore";

const allowedTransitions: Record<
  EditorialStatus,
  readonly EditorialTransition[]
> = {
  DRAFT: ["publish", "archive"],
  PUBLISHED: ["publish", "unpublish", "archive"],
  ARCHIVED: ["restore"],
};

export function canTransitionEditorialStatus(
  status: EditorialStatus,
  transition: EditorialTransition,
) {
  return allowedTransitions[status].includes(transition);
}

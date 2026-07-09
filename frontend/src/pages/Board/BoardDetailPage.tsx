import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../layouts/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  archiveBoard,
  clearSelectedBoard,
  deleteBoard,
  fetchBoardById,
  updateBoard,
  uploadBoardBackground,
} from "../../features/board/boardSlice";
import {
  updateBoardSchema,
  type UpdateBoardFormValues,
} from "../../features/board/boardValidation";
import { useToast } from "../../components/toast/toastContext";
import { validateImageFile } from "../../utils/validateImageFile";

export default function BoardDetailPage() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selected: board, selectedStatus } = useAppSelector(
    (state) => state.board,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBoardFormValues>({
    resolver: zodResolver(updateBoardSchema),
    values: board
      ? {
          name: board.name,
          description: board.description,
        }
      : undefined,
  });

  useEffect(() => {
    if (!boardId) return;

    dispatch(fetchBoardById(boardId));

    return () => {
      dispatch(clearSelectedBoard());
    };
  }, [dispatch, boardId]);

  const onSubmit = async (values: UpdateBoardFormValues) => {
    if (!boardId) return;

    try {
      await dispatch(updateBoard({ boardId, payload: values })).unwrap();
      showToast("Board updated", "success");
      setIsEditing(false);
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to update board",
        "error",
      );
    }
  };

  const handleCancelEdit = () => {
    if (board) {
      reset({
        name: board.name,
        description: board.description,
      });
    }
    setIsEditing(false);
  };

  const handleBackgroundClick = () => fileInputRef.current?.click();

  const handleBackgroundChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !boardId) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setIsUploadingBackground(true);
    try {
      await dispatch(uploadBoardBackground({ boardId, file })).unwrap();
      showToast("Board background updated", "success");
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to upload background",
        "error",
      );
    } finally {
      setIsUploadingBackground(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!boardId) return;

    setIsArchiving(true);
    try {
      await dispatch(archiveBoard(boardId)).unwrap();
      showToast(
        board?.isArchived ? "Board restored" : "Board archived",
        "success",
      );
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to update board",
        "error",
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (!boardId) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteBoard(boardId)).unwrap();
      showToast("Board deleted", "success");
      navigate(`/workspaces/${workspaceId}`, { replace: true });
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to delete board",
        "error",
      );
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (selectedStatus === "loading" && !board) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (!board) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This board doesn’t exist or you don’t have access to it.
          </p>
          <Link
            to={workspaceId ? `/workspaces/${workspaceId}` : "/dashboard"}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            ← Back to workspace
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          to={workspaceId ? `/workspaces/${workspaceId}` : "/dashboard"}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          ← Back to workspace
        </Link>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div
            className="h-48 w-full bg-cover bg-center"
            style={{
              backgroundImage: board.background?.url
                ? `url(${board.background.url})`
                : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            }}
          />

          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
                  {board.workspace?.name ?? "Workspace board"}
                </p>
                {!isEditing && (
                  <>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {board.name}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {board.description || "No description yet."}
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {!isEditing && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={handleArchiveToggle}
                  isLoading={isArchiving}
                >
                  {board.isArchived ? "Restore board" : "Archive board"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>

            {board.isArchived && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                This board is archived and can be restored at any time.
              </div>
            )}

            {isEditing && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-700"
              >
                <Input
                  label="Name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Description"
                  error={errors.description?.message}
                  {...register("description")}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    Save
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Board background
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add a background image to make the board feel more personal.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleBackgroundClick}
              isLoading={isUploadingBackground}
            >
              Upload image
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleBackgroundChange}
          />
          <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/40">
            {board.background?.url ? (
              <img
                src={board.background.url}
                alt="Board background"
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                No background uploaded yet.
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete board"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete <strong>{board.name}</strong>? This
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

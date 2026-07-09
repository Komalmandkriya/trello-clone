import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../layouts/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clearSelectedWorkspace,
  deleteWorkspace,
  fetchWorkspaceById,
  updateWorkspace,
  uploadWorkspaceLogo,
} from "../../features/workspace/workspaceSlice";
import {
  updateWorkspaceSchema,
  type UpdateWorkspaceFormValues,
} from "../../features/workspace/workspaceValidation";
import {
  createBoard,
  fetchBoardsByWorkspace,
} from "../../features/board/boardSlice";
import {
  createBoardSchema,
  type CreateBoardFormValues,
} from "../../features/board/boardValidation";
import { useToast } from "../../components/toast/toastContext";
import { validateImageFile } from "../../utils/validateImageFile";

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { selected: workspace, selectedStatus } = useAppSelector(
    (state) => state.workspace,
  );
  const { items: boards, listStatus: boardListStatus } = useAppSelector(
    (state) => state.board,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateWorkspaceFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    values: workspace
      ? {
          name: workspace.name,
          description: workspace.description,
          visibility: workspace.visibility,
        }
      : undefined,
  });

  const {
    register: registerBoard,
    handleSubmit: handleCreateBoardSubmit,
    reset: resetCreateBoardForm,
    formState: {
      errors: createBoardErrors,
      isSubmitting: isCreateBoardSubmitting,
    },
  } = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!workspaceId) return;

    dispatch(fetchWorkspaceById(workspaceId));
    dispatch(fetchBoardsByWorkspace(workspaceId));

    return () => {
      dispatch(clearSelectedWorkspace());
    };
  }, [dispatch, workspaceId]);

  const isOwner = Boolean(
    workspace && currentUser && workspace.owner._id === currentUser._id,
  );

  const onSubmit = async (values: UpdateWorkspaceFormValues) => {
    if (!workspaceId) return;

    try {
      await dispatch(
        updateWorkspace({ workspaceId, payload: values }),
      ).unwrap();
      showToast("Workspace updated", "success");
      setIsEditing(false);
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to update workspace",
        "error",
      );
    }
  };

  const handleCancelEdit = () => {
    if (workspace) {
      reset({
        name: workspace.name,
        description: workspace.description,
        visibility: workspace.visibility,
      });
    }
    setIsEditing(false);
  };

  const handleLogoClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !workspaceId) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setIsUploadingLogo(true);
    try {
      await dispatch(uploadWorkspaceLogo({ workspaceId, file })).unwrap();
      showToast("Logo updated", "success");
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to upload logo",
        "error",
      );
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleCreateBoard = async (values: CreateBoardFormValues) => {
    if (!workspaceId) return;

    setIsCreatingBoard(true);
    try {
      const board = await dispatch(
        createBoard({
          workspaceId,
          name: values.name,
          description: values.description,
        }),
      ).unwrap();
      showToast("Board created", "success");
      resetCreateBoardForm();
      setIsCreateBoardOpen(false);
      navigate(`/workspaces/${workspaceId}/boards/${board._id}`);
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to create board",
        "error",
      );
    } finally {
      setIsCreatingBoard(false);
    }
  };

  const handleDelete = async () => {
    if (!workspaceId) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteWorkspace(workspaceId)).unwrap();
      showToast("Workspace deleted", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Failed to delete workspace",
        "error",
      );
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (selectedStatus === "loading" && !workspace) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (!workspace) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This workspace doesn't exist or you don't have access to it.
          </p>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            ← Back to dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          ← Back to dashboard
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleLogoClick}
                disabled={isUploadingLogo}
                className="group relative rounded-full focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed"
                aria-label="Change workspace logo"
              >
                <Avatar
                  name={workspace.name}
                  url={workspace.logo.url}
                  size="lg"
                />
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {isUploadingLogo ? <Spinner className="h-5 w-5" /> : "Change"}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {!isEditing && (
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {workspace.name}
                  </h1>
                  {workspace.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {workspace.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    workspace.visibility === "public"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {workspace.visibility === "public" ? "Public" : "Private"}
                </span>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>

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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Visibility
                </label>
                <select
                  {...register("visibility")}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
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
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Boards
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create and open boards for this workspace.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsCreateBoardOpen(true)}
            >
              Create board
            </Button>
          </div>

          {boardListStatus === "loading" ? (
            <div className="mt-6 flex justify-center py-6">
              <Spinner className="h-6 w-6" />
            </div>
          ) : boards.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
              No boards yet. Create the first one to start planning work.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {boards.map((board) => (
                <Link
                  key={board._id}
                  to={`/workspaces/${workspaceId}/boards/${board._id}`}
                  className={`rounded-2xl border p-4 transition-colors hover:border-brand-400 hover:bg-white dark:hover:bg-slate-900 ${
                    board.isArchived
                      ? "border-amber-300 bg-amber-50/70 dark:border-amber-700 dark:bg-amber-950/20"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40"
                  }`}
                >
                  <div
                    className="h-24 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: board.background?.url
                        ? `url(${board.background.url})`
                        : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    }}
                  />
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {board.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {board.description || "No description yet."}
                      </p>
                    </div>
                    {board.isArchived && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Archived
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Members ({workspace.members.length})
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {workspace.members.map((member) => (
              <li
                key={member._id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={member.user.name}
                    url={member.user.avatar.url}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {member.user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 capitalize dark:text-slate-500">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {isOwner && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Danger zone
            </h2>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              Deleting a workspace is permanent and cannot be undone.
            </p>
            <Button
              variant="danger"
              className="mt-3"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete workspace
            </Button>
          </section>
        )}
      </div>

      <Modal
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        title="Create board"
      >
        <form
          onSubmit={handleCreateBoardSubmit(handleCreateBoard)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Name"
            error={createBoardErrors.name?.message}
            {...registerBoard("name")}
          />
          <Input
            label="Description"
            error={createBoardErrors.description?.message}
            {...registerBoard("description")}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateBoardOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isCreateBoardSubmitting || isCreatingBoard}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete workspace"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete <strong>{workspace.name}</strong>?
          This cannot be undone.
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

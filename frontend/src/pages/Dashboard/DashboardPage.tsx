import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Avatar from "../../components/ui/Avatar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createWorkspace, fetchWorkspaces } from "../../features/workspace/workspaceSlice";
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from "../../features/workspace/workspaceValidation";
import { useToast } from "../../components/toast/toastContext";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const { items: workspaces, listStatus } = useAppSelector((state) => state.workspace);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const closeModal = () => {
    reset();
    setIsModalOpen(false);
  };

  const onCreate = async (values: CreateWorkspaceFormValues) => {
    try {
      await dispatch(createWorkspace(values)).unwrap();
      showToast("Workspace created", "success");
      closeModal();
    } catch (error) {
      showToast(typeof error === "string" ? error : "Failed to create workspace", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Welcome back{user ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Here are your workspaces.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>New workspace</Button>
        </div>

        {listStatus === "loading" && workspaces.length === 0 ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : workspaces.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800/50">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No workspaces yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Create your first workspace to start organizing boards with your team.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <Link
                key={workspace._id}
                to={`/workspaces/${workspace._id}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={workspace.name} url={workspace.logo.url} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {workspace.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {workspace.members.length}{" "}
                      {workspace.members.length === 1 ? "member" : "members"}
                    </p>
                  </div>
                </div>
                {workspace.description && (
                  <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {workspace.description}
                  </p>
                )}
                <span
                  className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    workspace.visibility === "public"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {workspace.visibility === "public" ? "Public" : "Private"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create workspace">
        <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input
            label="Description (optional)"
            error={errors.description?.message}
            {...register("description")}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

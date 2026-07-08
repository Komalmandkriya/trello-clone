import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../layouts/DashboardLayout";
import Spinner from "../../components/ui/Spinner";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProfile, updateProfile, uploadAvatar } from "../../features/auth/authSlice";
import { useToast } from "../../components/toast/toastContext";
import { updateNameSchema, type UpdateNameFormValues } from "../../features/auth/authValidation";
import { validateImageFile } from "../../utils/validateImageFile";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    values: { name: user?.name ?? "" },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const onSubmitName = async (values: UpdateNameFormValues) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      showToast("Name updated", "success");
      setIsEditingName(false);
    } catch (error) {
      showToast(typeof error === "string" ? error : "Failed to update name", "error");
    }
  };

  const handleCancelEdit = () => {
    reset({ name: user?.name ?? "" });
    setIsEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await dispatch(uploadAvatar(file)).unwrap();
      showToast("Avatar updated", "success");
    } catch (error) {
      showToast(typeof error === "string" ? error : "Failed to upload avatar", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Your profile
          </h1>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="group relative rounded-full focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed"
                aria-label="Change avatar"
              >
                <Avatar name={user.name} url={user.avatar.url} size="lg" />
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {isUploadingAvatar ? <Spinner className="h-5 w-5" /> : "Change"}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {isEditingName ? (
                <form
                  onSubmit={handleSubmit(onSubmitName)}
                  className="flex flex-col gap-2 sm:flex-row sm:items-end"
                >
                  <Input
                    label=""
                    className="mb-0"
                    autoFocus
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" isLoading={isSubmitting} className="shrink-0">
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancelEdit}
                      className="shrink-0"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              )}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                user.isVerified
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}
            >
              {user.isVerified ? "Verified account" : "Unverified account"}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 dark:border-slate-700">
            <div>
              <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">
                Last updated
              </dt>
              <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {formatDate(user.updatedAt)}
              </dd>
            </div>
          </dl>

          {status === "loading" && (
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Refreshing profile...
            </p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

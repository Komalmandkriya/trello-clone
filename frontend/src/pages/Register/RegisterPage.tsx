import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "../../features/auth/authSlice";
import { useToast } from "../../components/toast/toastContext";
import { registerFormSchema, type RegisterFormValues } from "../../features/auth/authValidation";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      showToast("Account created successfully!", "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showToast(typeof error === "string" ? error : "Registration failed", "error");
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start organizing your work with boards">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <p className="-mt-2 text-xs text-slate-400">
          Must be 8+ characters with uppercase, lowercase, a number and a special character.
        </p>
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

import { Modal } from "@mantine/core";
import CommonForm from "../common/CommonForm";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import { ApiRegister } from "@/api/auth";
import showNotify from "@/utils/notify";
import PasswordInputWithStrength from "../common/PasswordInputWithStrength";

// Validation schema
const schema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .regex(/^[^\d]*$/, "Full name should not contain numbers"),
    email: z
      .string()
      .email("Invalid email address")
      .refine((val) => !/^\d/.test(val), {
        message: "Email should not start with a number",
      }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    position: z.string().min(1, "Expertise is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface RegisterForm extends z.infer<typeof schema> {}

// ✅ Define the exact props the parent is passing
interface RegisterModalProps {
  triggerOpen: boolean;
  setTriggerOpen: (val: boolean) => void;
  openLoginModal: () => void;
}

const RegisterModal = ({ triggerOpen, setTriggerOpen, openLoginModal }: RegisterModalProps) => {
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      autoComplete: "off",
    },
    { name: "email", label: "Email", placeholder: "your@email.com" },
    {
      name: "position",
      label: "Expertise",
      placeholder: "e.g., Web Developer",
    },
    {
      name: "password",
      render: () => (
        <PasswordInputWithStrength
          name="password"
          label="Password"
          placeholder="Create a password"
        />
      ),
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Re-enter password",
      autoComplete: "new-password",
    },
  ];

  const handleSubmit: SubmitHandler<RegisterForm> = async (formData) => {
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        position: formData.position.trim(),
        role: "USER",
        status: "APPROVED",
      };

      const res = await ApiRegister(payload);

      if (res?.data?.id) {
        showNotify("success", "Registration successful. Please log in.");
        openLoginModal(); // This automatically closes Register & opens Login via the parent
      } else {
        showNotify("error", "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error("Register error (raw):", error);

      let errData: any = null;

      if (error?.response && (error.response.data || error.response.status)) {
        errData = error.response.data ?? {
          status: error.response.status,
          message: error.response.statusText,
        };
      }

      if (!errData && typeof error === "object" && (error.statusCode || error.message)) {
        errData = error;
      }

      if (!errData && typeof error === "string") {
        try {
          const parsed = JSON.parse(error);
          if (parsed && (parsed.statusCode || parsed.message)) errData = parsed;
        } catch (e) {
          errData = { message: error };
        }
      }

      if (!errData && typeof error?.message === "string") {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed && (parsed.statusCode || parsed.message)) errData = parsed;
          else errData = { message: error.message };
        } catch {
          errData = { message: error.message };
        }
      }

      errData = errData || { message: "Unexpected error", statusCode: 500 };

      const code = Number(errData.statusCode || errData.status || error?.response?.status || 500);
      const message = String(errData.message || errData.error || "Unexpected error");

      if (code === 409) {
        showNotify("error", "Account already exists. Please log in.");
        openLoginModal();
        return;
      }

      showNotify("error", message);
    }
  };

  return (
    <Modal
      opened={triggerOpen}
      onClose={() => setTriggerOpen(false)}
      title={<span className="text-primary font-bold text-xl">Sign Up Now</span>}
      centered
      size="md"
      radius="xl"
      classNames={{
        content: "bg-background/95 backdrop-blur-xl border border-border/50",
        header: "bg-transparent border-b border-border/50 pb-4 pt-6 px-6",
        body: "px-2 sm:px-6 py-4"
      }}
      transitionProps={{
        transition: "fade",
        duration: 300,
        timingFunction: "ease",
      }}
    >
      <CommonForm
        fields={fields}
        onSubmit={handleSubmit}
        validationSchema={zodResolver(schema)}
        buttonText="Register Account"
        footerLinkText="Already have an account?"
        footerLinkLabel="Login"
        footerLinkAction={openLoginModal}
      />
    </Modal>
  );
};

export default RegisterModal;
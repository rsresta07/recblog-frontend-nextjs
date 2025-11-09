import { Modal } from "@mantine/core";
import { useState } from "react";
import CommonForm from "../common/CommonForm";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { ApiRegister } from "@/api/auth";
import showNotify from "@/utils/notify";
import { useAuth } from "@/utils/hooks/useAuth";
import LoginModal from "./LoginModal";
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

const RegisterModal = ({ openLoginModal }: { openLoginModal: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

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
        setIsOpen(false);
        setShowLogin(true);
      } else {
        showNotify("fail", "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      const code = error?.response?.data?.statusCode ?? error?.response?.status;
      const message = error?.response?.data?.message || "Unexpected error";

      if (code === 409) {
        showNotify("fail", "Account already exists. Please log in.");
        openLoginModal();
      } else {
        showNotify("fail", message);
      }
    }
  };

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title={
          <span className="text-primary font-bold text-xl">Sign Up Now</span>
        }
        centered
        size="lg"
        transitionProps={{
          transition: "fade",
          duration: 400,
          timingFunction: "ease",
        }}
      >
        <CommonForm
          fields={fields}
          onSubmit={handleSubmit}
          validationSchema={zodResolver(schema)}
          buttonText="Register"
          showCheckbox
          footerLinkText="Already have an account?"
          footerLinkLabel="Login"
          footerLinkAction={() => {
            setIsOpen(false);
            setShowLogin(true);
          }}
          twoColumnLayout
        />
      </Modal>

      <button
        onClick={() => setIsOpen(true)}
        className="text-md font-normal text-primary hover:underline decoration-secondary decoration-4 underline-offset-4 transition-all duration-300"
      >
        Sign Up
      </button>

      <LoginModal
        triggerOpen={showLogin}
        setTriggerOpen={setShowLogin}
        openRegisterModal={() => setIsOpen(true)}
      />
    </>
  );
};

export default RegisterModal;

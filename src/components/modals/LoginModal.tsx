import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import CommonForm from "../common/CommonForm";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiLogin } from "@/api/auth";
import { setCookie } from "cookies-next";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import showNotify from "@/utils/notify";

const schema = z.object({
  email: z.string().email("Email not valid"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Za-z]/, "Password should contain at least one letter")
    .regex(/[0-9]/, "Password should contain at least one number"),
});

interface LoginForm {
  email: string;
  password: string;
}

/**
 * LoginModal component renders a modal for user login.
 *
 * Props:
 * - openRegisterModal: Function to open the registration modal.
 * - triggerOpen: Optional boolean to control the initial open state of the modal.
 * - setTriggerOpen: Optional function to update the open state externally.
 *
 * Features:
 * - Provides email and password input fields.
 * - Validates user input using zod schema.
 * - Submits the login form and handles authentication.
 * - Redirects users based on their roles after successful login.
 * - Displays error notifications on authentication failure.
 * - Integrates with router events to manage modal transitions.
 */
const LoginModal = ({
  openRegisterModal,
  triggerOpen,
  setTriggerOpen,
}: {
  openRegisterModal: () => void;
  triggerOpen?: boolean;
  setTriggerOpen?: (val: boolean) => void;
}) => {
  const router = useRouter();

  const fields = [
    { name: "email", label: "Email", placeholder: "Enter your email" },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
  ];

  const handleSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await ApiLogin(data);

      if (res?.data?.id) {
        const user = {
          id: res.data.id,
          email: res.data.email,
          slug: res.data.slug,
          role: res.data.role,
        };

        setCookie("token", res.data.token);
        setCookie("user", JSON.stringify(user));

        if (user.role === "SUPER_ADMIN") window.location.href = "/dashboard";
        else window.location.href = "/";
      } else {
        showNotify("error", "Wrong credentials");
      }
    } catch {
      showNotify("error", "Wrong credentials");
    }
  };

  return (
    <Modal
      opened={triggerOpen ?? false}
      onClose={() => setTriggerOpen?.(false)}
      title="Sign In"
      centered
      transitionProps={{
        transition: "fade",
        duration: 600,
        timingFunction: "linear",
      }}
    >
      <CommonForm
        fields={fields}
        onSubmit={handleSubmit}
        validationSchema={zodResolver(schema)}
        buttonText="Sign In"
        showCheckbox={false}
        footerLinkText="Don't have an account?"
        footerLinkLabel="Sign Up"
        footerLinkAction={() => setTriggerOpen?.(false) || openRegisterModal()}
        twoColumnLayout={false}
      />
    </Modal>
  );
};

export default LoginModal;

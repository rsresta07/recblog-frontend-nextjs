import { useForm, FormProvider } from "react-hook-form";
import { TextInput, PasswordInput, Text, Anchor } from "@mantine/core";

const CommonForm = ({
                      fields,
                      onSubmit,
                      validationSchema,
                      buttonText = "Submit",
                      footerLinkText = "",
                      footerLinkLabel = "",
                      footerLinkAction = () => {},
                    }: any) => {
  const methods = useForm({
    resolver: validationSchema,
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const renderInput = (field: any) => {
    if (field.render) return <div key={field.name}>{field.render()}</div>;

    const InputComponent = field.type === "password" ? PasswordInput : TextInput;

    return (
      <InputComponent
        {...register(field.name)}
        key={field.name}
        label={<span className="font-semibold text-sm mb-1 block">{field.label}</span>}
        placeholder={field.placeholder}
        type={field.type || "text"}
        autoComplete={field.autoComplete ?? "off"}
        withAsterisk
        classNames={{
          input: "bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary",
        }}
        error={
          typeof errors[field.name]?.message === "string" && (
            <Text color="red" size="xs" mt={4}>{errors[field.name]?.message as string}</Text>
          )
        }
      />
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2 sm:p-4" autoComplete="off">
        <div className="space-y-5">{fields.map(renderInput)}</div>

        <button
          type="submit"
          className="w-full inline-flex justify-center items-center font-semibold py-3 px-6 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-md shadow-sm hover:bg-primary transition-all duration-300 mt-4"
        >
          {buttonText}
        </button>

        {footerLinkLabel && (
          <div className="text-sm text-center text-muted-foreground pt-2">
            {footerLinkText}{" "}
            <Anchor
              component="button"
              onClick={footerLinkAction}
              className="font-semibold text-primary hover:text-accent transition-colors"
            >
              {footerLinkLabel}
            </Anchor>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default CommonForm;
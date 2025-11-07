import { useForm, FormProvider } from "react-hook-form";
import { TextInput, Button, Text, Anchor } from "@mantine/core";

const CommonForm = ({
  fields,
  onSubmit,
  validationSchema,
  buttonText = "Submit",
  footerLinkText = "",
  footerLinkLabel = "",
  footerLinkAction = () => {},
  twoColumnLayout = true,
}: any) => {
  const methods = useForm({
    resolver: validationSchema,
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const renderInput = (field: any) => {
    if (field.render) {
      return <div key={field.name}>{field.render()}</div>;
    }

    return (
      <TextInput
        {...register(field.name)}
        key={field.name}
        label={field.label}
        placeholder={field.placeholder}
        type={field.type || "text"}
        autoComplete={field.autoComplete ?? "off"}
        withAsterisk
        classNames={{
          input:
            "bg-background text-foreground border border-border placeholder:text-muted-foreground",
          label: "text-primary",
        }}
        error={
          typeof errors[field.name]?.message === "string" && (
            <Text color="red">{errors[field.name]?.message as string}</Text>
          )
        }
      />
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 p-4"
        autoComplete="off"
      >
        <div className="space-y-4">{fields.map(renderInput)}</div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md"
        >
          {buttonText}
        </button>

        {footerLinkLabel && (
          <Text size="sm" className="text-foreground">
            {footerLinkText}{" "}
            <Anchor
              component="button"
              onClick={footerLinkAction}
              className="cursor-pointer text-secondary hover:underline"
            >
              {footerLinkLabel}
            </Anchor>
          </Text>
        )}
      </form>
    </FormProvider>
  );
};

export default CommonForm;

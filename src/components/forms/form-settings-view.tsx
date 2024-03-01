"use client";

import { useDialog } from "@/hooks/use-dialog";
import {
  useFormById,
  useFormDeleteMutation,
  useFormUpdateMutation,
} from "@/queries/form.queries";
import { type FormOutput, type FormUpdateData } from "@/types/form.types";
import { useRouter } from "next/navigation";
import { isEqual, pick } from "radash";
import { useEffect, useState } from "react";
import { Paper } from "../ui/paper";
import { Divider } from "../ui/divider";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { FormDeleteDialog } from "./form-delete-dialog";
import { FormRespondantEmailTemplateDialog } from "./form-respondant-email-template-dialog";
import { Textarea } from "../ui/textarea";

interface Props {
  orgId: string;
  formId: string;
}

export function FormSettingsView({ orgId, formId }: Props) {
  const router = useRouter();
  const [deleteModal, deleteModalHandler] = useDialog();
  const [respondantEmailModal, respondantEmailModalHandler] = useDialog();
  const { data: formData } = useFormById(formId as string, {
    refetchOnWindowFocus: false,
  });

  const [form, setForm] = useState<FormOutput | null | undefined>(formData);

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  const updateMutation = useFormUpdateMutation();
  const deleteMutation = useFormDeleteMutation(orgId);

  const handleDeleteForm = async () => {
    try {
      await deleteMutation.mutateAsync({ id: formId });
      router.push(`/dashboard/${orgId}/forms`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettingsSave = async (data?: FormUpdateData) => {
    try {
      if (!form) return;
      const updateData = pick(form, [
        "name",
        "sendEmailNotifications",
        "isClosed",
        "sendRespondantEmailNotifications",
        "closeMessageTitle",
        "closeMessageDescription",
        "limitResponses",
        "maxResponses",
        "saveAnswers",
        "showCustomClosedMessage",
        "webhookEnabled",
        "webhookUrl",
        "removeFormboxBranding",
        "respondantEmailFromName",
        "respondantEmailSubject",
        "respondantEmailMessageHTML",
      ]);
      await updateMutation.mutateAsync({ id: formId, ...updateData, ...data });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          name: inputValue,
        },
    );
  };

  const handleRemoveFormboxBrandingChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          removeFormboxBranding: !prevForm.removeFormboxBranding,
        },
    );
  };

  // const handleSaveAnswersChange = () => {
  //   setForm(
  //     (prevForm) =>
  //       prevForm && {
  //         ...prevForm,
  //         saveAnswers: !prevForm.saveAnswers,
  //       },
  //   );
  // };

  const handleEmailNotificationChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          sendEmailNotifications: !prevForm.sendEmailNotifications,
        },
    );
  };

  const handleCloseFormChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          isClosed: !prevForm.isClosed,
        },
    );
  };

  const handleRespondantEmailNotificationChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          sendRespondantEmailNotifications:
            !prevForm.sendRespondantEmailNotifications,
        },
    );
  };

  const handleLimitResponsesChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          limitResponses: !prevForm.limitResponses,
        },
    );
  };

  const handleMaxResponsesChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          maxResponses: Number(inputValue),
        },
    );
  };

  const handleCloseMessageChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          showCustomClosedMessage: !prevForm.showCustomClosedMessage,
        },
    );
  };

  const handleCloseMessageTitleChange = (
    e: React.FormEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          closeMessageTitle: inputValue,
        },
    );
  };

  const handleCloseMessageDescriptionChange = (
    e: React.FormEvent<HTMLTextAreaElement>,
  ) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          closeMessageDescription: inputValue,
        },
    );
  };

  const handleWebhookEnabledChange = () => {
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          webhookEnabled: !prevForm.webhookEnabled,
        },
    );
  };

  const handleWebhookUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setForm(
      (prevForm) =>
        prevForm && {
          ...prevForm,
          webhookUrl: inputValue,
        },
    );
  };

  return (
    <div className="pb-[100px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Settings</h3>
          <p className="mt-2 text-gray-600">Manage your form settings.</p>
        </div>
      </div>

      <div className="mt-8">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">General</h3>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-x-16 sm:space-y-0">
              <div className="space-y-1">
                <h4 className="font-semibold">Form name</h4>
                <p className="text-sm text-gray-600">
                  Only visible to you and your teammates.
                </p>
              </div>
              <div>
                <Input
                  className="sm:w-[400px]"
                  defaultValue={form?.name}
                  onChange={handleNameChange}
                />
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Remove Formbox branding</h4>
                <p className="text-sm text-gray-600">
                  Remove &quot;Powered by Formbox&quot; branding on your form.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.removeFormboxBranding}
                  onCheckedChange={handleRemoveFormboxBrandingChange}
                  // disabled={!hasAccess("Auto responses")}
                />
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">Delete form</h4>
                <p className="text-sm text-gray-600">
                  Terminate your form with all of its submissions and data.
                </p>
              </div>
              <div>
                <Button
                  variant="outline"
                  leftIcon={<IconTrash size={16} className="text-red-600" />}
                  onClick={deleteModalHandler.open}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Email notifications</h3>
            </div>
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Self email notifications</h4>
                <p className="text-sm text-gray-600">
                  Get an email for new form submissions.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.sendEmailNotifications}
                  onCheckedChange={handleEmailNotificationChange}
                />
              </div>
            </div>
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">
                  Respondant email notifications
                </h4>
                <p className="text-sm text-gray-600">
                  Send a customized email to respondants after a successful form
                  submission.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.sendRespondantEmailNotifications}
                  onCheckedChange={handleRespondantEmailNotificationChange}
                  // disabled={!hasAccess("Auto responses")}
                />
              </div>
            </div>

            {form?.sendRespondantEmailNotifications && (
              <>
                <Divider className="mt-4" />

                <div className="mt-4 flex items-center justify-between space-x-16">
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      Auto response email template
                    </h4>
                    <p className="text-sm text-gray-600">
                      Customize your respondent email notification template.
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={respondantEmailModalHandler.open}
                      // disabled={!hasAccess("Auto responses")}
                    >
                      Edit template
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Paper>
      </div>

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">Access</h3>
                {/* {!hasAccess("Webhooks") && <ProBadge />} */}
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Close form</h4>
                <p className="text-sm text-gray-600">
                  People won&apos;t be able to respond to this form anymore.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.isClosed}
                  onCheckedChange={handleCloseFormChange}
                />
              </div>
            </div>
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">
                  Limit the number of submissions
                </h4>
                <p className="text-sm text-gray-600">
                  Set how many submissions this form can receive in total.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.limitResponses}
                  onCheckedChange={handleLimitResponsesChange}
                  // disabled={!hasAccess("Webhooks")}
                />
              </div>
            </div>

            {form?.limitResponses && (
              <div className="mt-4">
                <Input
                  placeholder="Max submissions"
                  type="number"
                  defaultValue={form?.maxResponses || Infinity}
                  onChange={handleMaxResponsesChange}
                  // disabled={!hasAccess("Webhooks")}
                />
              </div>
            )}
          </div>

          <Divider />

          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Closed form message</h4>
                <p className="text-sm text-gray-600">
                  This is what your recipients will see if you close the form
                  with one of the options above.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.showCustomClosedMessage}
                  onCheckedChange={handleCloseMessageChange}
                />
              </div>
            </div>

            {form?.showCustomClosedMessage && (
              <div className="mt-4 space-y-3">
                <Input
                  placeholder="Title"
                  defaultValue={form?.closeMessageTitle}
                  onChange={handleCloseMessageTitleChange}
                />
                <Textarea
                  placeholder="Description"
                  rows={3}
                  defaultValue={form?.closeMessageDescription}
                  onChange={handleCloseMessageDescriptionChange}
                />
              </div>
            )}
          </div>
        </Paper>
      </div>

      <div className="mt-5">
        <Paper>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold">Webhook</h3>
                {/* {!hasAccess("Webhooks") && <ProBadge />} */}
              </div>
            </div>
          </div>
          <Divider />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="space-y-1">
                <h4 className="font-semibold">Webhook enabled</h4>
                <p className="text-sm text-gray-600">
                  Send a webhook request on successful submissions.
                </p>
              </div>
              <div>
                <Switch
                  checked={form?.webhookEnabled}
                  onCheckedChange={handleWebhookEnabledChange}
                  // disabled={!hasAccess("Webhooks")}
                />
              </div>
            </div>

            {form?.webhookEnabled && (
              <>
                <Divider className="mt-4" />

                <div className="mt-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Webhook URL</h4>
                    <p className="text-sm text-gray-600">
                      Every time you receive a new form submission to your form
                      endpoint, JSON data will be posted to this URL.
                    </p>
                  </div>
                  <div>
                    <Input
                      className="mt-4"
                      placeholder="https://example.com/webhook"
                      defaultValue={form?.webhookUrl}
                      onChange={handleWebhookUrlChange}
                      // disabled={!hasAccess("Webhooks")}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Paper>
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white py-5">
        <MaxWidthWrapper>
          <Button
            leftIcon={<IconDeviceFloppy size={16} />}
            loading={updateMutation.isLoading}
            disabled={isEqual(formData, form)}
            onClick={() => handleSettingsSave()}
          >
            Save changes
          </Button>
        </MaxWidthWrapper>
      </div>

      <FormRespondantEmailTemplateDialog
        open={respondantEmailModal}
        onClose={respondantEmailModalHandler.close}
        submit={handleSettingsSave}
        form={form as FormOutput}
      />

      <FormDeleteDialog
        title={form?.name}
        open={deleteModal}
        onClose={deleteModalHandler.close}
        onDelete={handleDeleteForm}
        loading={deleteMutation.isLoading}
      />
    </div>
  );
}

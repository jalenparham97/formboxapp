"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  type IntegrationOutput,
  type IntegrationType,
} from "@/types/integration.types";
import { createConnection } from "@/libs/nango/client";

import GoogleSheetLogo from "@/images/google-sheets-logo.svg";
import AirTableLogo from "@/images/airtable-logo.svg";
import NotionLogo from "@/images/notion-logo.svg";
import SlackLogo from "@/images/slack-logo.svg";
import MailChimpLogo from "@/images/mailchimp-logo.svg";
import GithubLogo from "@/images/github-logo.svg";
import {
  useIntegrationAddMutation,
  useIntegrationUpdateMutation,
  useIntegrations,
} from "@/queries/integration.queries";
import { Badge } from "../ui/badge";
import {
  GooleSheetActionsMenu,
  IntegrationCardActionsMenu,
} from "../integrations/integration-card-actions-menu";
import { Switch } from "../ui/switch";
import { ToolTip } from "../ui/tooltip";
import { useAuthUser } from "@/queries/user.queries";
import { useOrgMemberRole } from "@/queries/org.queries";

interface Props {
  orgId: string;
  formId: string;
}

export function FormIntegrationsView({ orgId, formId }: Props) {
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const { data: connectedIntegrations } = useIntegrations(formId);

  const integrations = useMemo(() => {
    return [
      {
        id: "google-sheets",
        name: "Google Sheets",
        description: "Send submissions to a spreadsheet.",
        image: GoogleSheetLogo,
        class: "w-8",
        comingSoom: false,
      },
      {
        id: "slack",
        name: "Slack",
        description: "Send Slack messages for new submissions.",
        image: SlackLogo,
        class: "w-10",
        comingSoom: true,
      },
      {
        id: "airtable",
        name: "Airtable",
        description: "Send submissions to Airtable.",
        image: AirTableLogo,
        class: "w-10",
        comingSoom: true,
      },
      {
        id: "notion",
        name: "Notion",
        description: "Send submissions to Notion.",
        image: NotionLogo,
        class: "w-10",
        comingSoom: true,
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Sync data with your Mailchimp email list.",
        image: MailChimpLogo,
        class: "w-10",
        comingSoom: true,
      },
      {
        id: "github",
        name: "Github",
        description: "Create Github issues from your submissions.",
        image: GithubLogo,
        class: "w-10",
        comingSoom: true,
      },
    ];
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Integrations</h3>
          <p className="mt-2 max-w-lg text-gray-600">
            Make Formbox even more powerful by using these tools. Check out our
            roadmap for upcoming integrations and to request new ones.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.name}
              type={integration.id as IntegrationType}
              name={integration.name}
              description={integration.description}
              image={integration.image}
              className={integration.class}
              formId={formId}
              orgId={orgId}
              comingSoom={integration.comingSoom}
              isConnected={connectedIntegrations?.data.some(
                (i) => i.type === integration.id,
              )}
              userRole={userRole?.role}
              connectedIntegration={connectedIntegrations?.data.find(
                (i) => i.type === integration.id,
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface IntegrationCardProps {
  type: IntegrationType;
  name: string;
  description: string;
  image: string;
  className: string;
  formId: string;
  orgId: string;
  isConnected?: boolean;
  comingSoom?: boolean;
  connectedIntegration?: IntegrationOutput;
  userRole?: string;
}

function IntegrationCard({
  type,
  name,
  description,
  image,
  className,
  formId,
  orgId,
  isConnected,
  comingSoom,
  connectedIntegration,
  userRole,
}: IntegrationCardProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | undefined>(false);

  useEffect(() => {
    setIsEnabled(connectedIntegration?.isEnabled);
  }, [connectedIntegration?.isEnabled]);

  const createMutation = useIntegrationAddMutation();
  const updateMutation = useIntegrationUpdateMutation();

  async function handleConnect() {
    const result = await createConnection(type, formId);
    return await createMutation.mutateAsync({
      formId,
      orgId,
      type,
      connectionId: result.connectionId,
    });
  }

  async function handleIntegrationUpdate(checked: boolean) {
    setIsEnabled(checked);
    return await updateMutation.mutateAsync({
      id: connectedIntegration?.id as string,
      isEnabled: checked,
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={image}
            alt=""
            className={className}
            width={100}
            height={100}
          />
          <CardTitle>{name}</CardTitle>
        </div>
        {comingSoom && (
          <Badge variant="blue" className="text-xs">
            Coming soon
          </Badge>
        )}
        {!comingSoom && isConnected && (
          <ToolTip
            message={connectedIntegration?.isEnabled ? "Enabled" : "Disabled"}
          >
            <Switch
              checked={isEnabled}
              onCheckedChange={handleIntegrationUpdate}
              disabled={userRole === "viewer"}
            />
          </ToolTip>
        )}
      </div>
      <CardContent className="mt-5">
        <p className="truncate text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="mt-5 flex items-center justify-between">
        {isConnected && (
          <>
            <Badge variant="green">Connected</Badge>
            {renderActionMenu(type, connectedIntegration, userRole)}
          </>
        )}
        {!isConnected && (
          <>
            <Button
              variant="outline"
              leftIcon={<IconPlus size={16} />}
              onClick={handleConnect}
              loading={createMutation.isLoading}
              disabled={comingSoom}
            >
              {createMutation.isLoading ? "Connecting" : "Connect"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

type ActionMenuMap = {
  "google-sheets": React.JSX.Element;
  slack: React.JSX.Element;
  airtable: React.JSX.Element;
  notion: React.JSX.Element;
  mailchimp: React.JSX.Element;
  github: React.JSX.Element;
};

const renderActionMenu = (
  integrationType: IntegrationType,
  connectedIntegration: IntegrationOutput | null | undefined,
  userRole: string | undefined,
) => {
  const actionMenuMap = {
    "google-sheets": (
      <GooleSheetActionsMenu
        integration={connectedIntegration}
        disabled={userRole === "viewer"}
      />
    ),
    slack: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    airtable: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    notion: <IntegrationCardActionsMenu integration={connectedIntegration} />,
    mailchimp: (
      <IntegrationCardActionsMenu integration={connectedIntegration} />
    ),
    github: <IntegrationCardActionsMenu integration={connectedIntegration} />,
  } as const;

  return actionMenuMap[integrationType as keyof ActionMenuMap];
};

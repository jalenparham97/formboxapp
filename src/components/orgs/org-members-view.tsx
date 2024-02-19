"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { isEmpty } from "radash";
import { EmptyState } from "../ui/empty-state";
import { IconMailForward, IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { useDialog } from "@/hooks/use-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { dayjs } from "@/libs/dayjs";
import { DeleteDialog } from "../ui/delete-dialog";
import { cn } from "@/utils/tailwind-helpers";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  useCreateOrgInviteMutation,
  useOrgById,
  useOrgInvites,
  useOrgMemberDeleteMutation,
  useOrgMembers,
} from "@/queries/org.queries";
import type { OrgMember } from "@/types/org.types";
import { Roles } from "@/types/utility.types";
import { OrgInviteDialog } from "./org-invite-dialog";

const loadingMembersAndInvites = new Array(3).fill("");

interface Props {
  orgId: string;
}

export function OrgMembersView({ orgId }: Props) {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const [inviteModal, inviteModalHandler] = useDialog();
  const [inviteDeleteModal, inviteDeleteModalHandler] = useDialog();
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [defaultTab, setDefaultTab] = useState("members");
  const { data: org, isLoading } = useOrgById(orgId);
  const { data: members, isLoading: isMembersLoading } = useOrgMembers(orgId);
  const { data: invites, isLoading: isInvitesLoading } = useOrgInvites(orgId);

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;

  useEffect(() => {
    if (tab) {
      setDefaultTab(tab);
    }
  }, [tab]);

  const createInviteMutation = useCreateOrgInviteMutation();

  const deleteInviteMutation = api.org.deleteInvite.useMutation({
    onSuccess: () => {},
    onSettled: async () => {
      apiUtils.org.getInvites.invalidate({ id: orgId });
    },
  });

  const sendInvite = async (email: string) => {
    setNewEmail(email);
    await createInviteMutation.mutateAsync({
      email,
      orgId,
      orgName: org?.name || "",
    });
  };

  const deleteInvite = async (id: string) => {
    await deleteInviteMutation.mutateAsync({ id });
  };

  function updateTabState(tab: "members" | "invites") {
    return router.push(`/${orgId}/settings/members?tab=${tab}`);
  }
  return (
    <div>
      <Card className="rounded-xl p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold">Organization members</h3>
              {org?.name && (
                <Badge variant={"gray"} className="capitalize">
                  {org?.name}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-gray-600">
              Teammates or collaborators that have access to this organization
              and it&apos;s workspaces.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              leftIcon={<IconPlus size={16} />}
              onClick={inviteModalHandler.open}
            >
              Invite member
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <Tabs value={defaultTab}>
            <TabsList>
              <TabsTrigger
                value="members"
                onClick={() => updateTabState("members")}
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="invites"
                onClick={() => updateTabState("invites")}
              >
                Invites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <div className="space-y-4 divide-y divide-gray-300">
                {isMembersLoading && (
                  <div className="space-y-4 pt-4">
                    {loadingMembersAndInvites.map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[60px] rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                )}
                {members?.map((member, index) => (
                  <MemberCard member={member} index={index} key={member?.id} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="invites">
              <div className="-mt-3 space-y-4 divide-y divide-gray-300">
                {isInvitesLoading && (
                  <div className="space-y-4 pt-4">
                    {loadingMembersAndInvites.map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[60px] rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                )}
                {!isInvitesLoading && (
                  <>
                    {!isEmpty(invites) && (
                      <>
                        {invites?.map((invite) => (
                          <div
                            key={invite?.id}
                            className="flex items-center justify-between pt-4"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarFallback className="uppercase text-white">
                                  {getInitials(invite?.email, 1)}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <p className="text-gray-600">{invite?.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <p className="text-gray-600">
                                Invited {dayjs(invite.createdAt).fromNow()}
                              </p>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={inviteDeleteModalHandler.open}
                              >
                                <IconTrash size={16} className="text-red-500" />
                              </Button>
                            </div>

                            <DeleteDialog
                              title="Invite"
                              open={inviteDeleteModal}
                              onClose={inviteDeleteModalHandler.close}
                              onDelete={() => deleteInvite(invite.id)}
                              loading={deleteInviteMutation.isLoading}
                            />
                          </div>
                        ))}
                      </>
                    )}
                    {isEmpty(invites) && (
                      <div className="mx-auto mb-5 mt-12 w-full lg:max-w-2xl">
                        <EmptyState
                          title="You dont have any invites yet"
                          subtitle="Invite a teammate to collaborate on this organization with."
                          icon={
                            <IconMailForward
                              size={50}
                              className="text-dark-500"
                            />
                          }
                          actionButton={
                            <Button
                              variant="outline"
                              leftIcon={<IconPlus size={16} />}
                              onClick={inviteModalHandler.open}
                            >
                              Invite member
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      <OrgInviteDialog
        open={inviteModal}
        onClose={inviteModalHandler.close}
        submit={sendInvite}
      />
    </div>
  );
}

interface MemberProps {
  member: OrgMember;
  index: number;
}

function MemberCard({ member, index }: MemberProps) {
  const [deleteModal, deleteModalHandler] = useDialog();

  const deleteMutation = useOrgMemberDeleteMutation(member?.org?.id);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ memberId: member.id });
  };

  const isMemberRole = member.role === Roles.MEMBER;
  const isOwnerRole = member.role === Roles.OWNER;

  return (
    <div
      key={member?.id}
      className={cn(
        "flex items-center justify-between pt-1",
        index !== 0 && "pt-4",
      )}
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={member?.user?.image || ""} />
          <AvatarFallback className="uppercase text-white">
            {getInitials(member?.user?.email, 1)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-semibold">{member?.user?.name}</p>
          <p className="text-sm text-gray-600">{member?.user?.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <p className="text-gray-600">
          Joined {dayjs(member.createdAt).fromNow()}
        </p>
        <Badge
          variant={isMemberRole ? "yellow" : "gray"}
          className="capitalize"
        >
          {member.role}
        </Badge>
        {!isOwnerRole && (
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={deleteModalHandler.open}
          >
            <IconTrash size={16} className="text-red-500" />
          </Button>
        )}
      </div>

      <DeleteDialog
        title="member"
        open={deleteModal}
        onClose={deleteModalHandler.close}
        onDelete={handleDelete}
        loading={deleteMutation.isLoading}
      />
    </div>
  );
}

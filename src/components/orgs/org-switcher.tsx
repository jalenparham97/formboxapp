"use client";

import * as React from "react";
import {
  IconCheck,
  IconChevronDown,
  IconPlus,
  IconSelector,
} from "@tabler/icons-react";

import { cn } from "@/utils/tailwind-helpers";
import { Button, DefaultButton } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type OrgsOutput } from "@/types/org.types";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";

type Org = OrgsOutput["data"][0];

function getOrg(slug: string, orgs: Org[]) {
  return orgs.find((org) => org.slug === slug);
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OrgSwitcherProps extends PopoverTriggerProps {
  orgs: Org[];
}

export function OrgSwitcher({ className, orgs }: OrgSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

  const slug = params.slug as string;

  const [selectedOrg, setSelectedOrg] = React.useState<Org>(
    getOrg(slug, orgs) as Org,
  );

  return (
    <div>
      {orgs && (
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <DefaultButton
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                aria-label="Select an organization"
                className={cn(
                  "h-[40px] w-[200px] justify-between text-base",
                  className,
                )}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-sm uppercase text-white">
                      {getInitials(selectedOrg?.name, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">
                    {selectedOrg?.name}
                  </span>
                </div>
                <IconSelector className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </DefaultButton>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search organization" />
                  <CommandEmpty>No organization found.</CommandEmpty>
                  <CommandGroup heading={"Organizations"}>
                    {orgs?.map((org) => (
                      <CommandItem
                        key={org.id}
                        onSelect={() => {
                          setSelectedOrg(org);
                          router.push(`/${org.id}`);
                          setOpen(false);
                        }}
                        className="text-sm"
                      >
                        {org.name}
                        <IconCheck
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedOrg?.name === org.name
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false);
                          setShowNewTeamDialog(true);
                        }}
                      >
                        <IconPlus className="mr-2 h-4 w-4" />
                        Create organization
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new organization</DialogTitle>
              <DialogDescription>
                Add a new organization to manage your workspaces and forms.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team name</Label>
                  <Input id="name" placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Subscription plan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">
                        <span className="font-medium">Free</span> -{" "}
                        <span className="text-muted-foreground">
                          Trial for two weeks
                        </span>
                      </SelectItem>
                      <SelectItem value="pro">
                        <span className="font-medium">Pro</span> -{" "}
                        <span className="text-muted-foreground">
                          $9/month per user
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewTeamDialog(false)}
              >
                Close
              </Button>
              <Button type="submit">Create organization</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

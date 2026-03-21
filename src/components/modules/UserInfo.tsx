"use client";
import { IconAt, IconBriefcase } from "@tabler/icons-react";
import CommonLink from "../common/CommonLink";
import EditPreferencesModal from "../modals/EditPreferencesModal";

interface UserInfoProps {
  userData: any;
  isOwner: boolean;
}

const UserInfo = ({ userData, isOwner }: UserInfoProps) => {
  if (!userData) return null;

  return (
    <div className="mb-16 p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
        <section>
          <div className="flex flex-wrap gap-x-4 items-end mb-2">
            <h2 className="!mb-0 text-primary">{userData?.fullName}</h2>
            <p className="text-sm font-medium text-muted-foreground pb-1">
              @{userData?.username}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-foreground/80">
              <IconAt size={18} className="text-muted-foreground" />
              <span>{userData?.email}</span>
            </div>
            {userData?.position && (
              <div className="flex items-center gap-2 text-foreground/80">
                <IconBriefcase size={18} className="text-muted-foreground" />
                <span>{userData?.position}</span>
              </div>
            )}
          </div>
        </section>

        {isOwner && (
          <div className="flex flex-row md:flex-col gap-3">
            <CommonLink
              link={`/user/${userData?.username}/edit-profile`}
              linkLabel="Edit profile"
            />
            <EditPreferencesModal />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
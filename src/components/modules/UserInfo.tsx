"use client";
import Link from "next/link";
import { IconAt, IconMapPin, IconPhone } from "@tabler/icons-react";
import CommonLink from "../common/CommonLink";
import EditPreferencesModal from "../modals/EditPreferencesModal";

interface UserInfoProps {
  userData: any;
  isOwner: boolean;
}

const UserInfo = ({ userData, isOwner }: UserInfoProps) => {
  if (!userData) return null;

  return (
    <div className="mb-32 p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-start w-full">
        <section>
          <div className="flex gap-4 items-center">
            <h2 className="text-3xl font-bold">{userData?.fullName}</h2>
            <p className="text-sm text-muted-foreground">
              @ {userData?.username}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-lg">
              <IconAt size={16} />
              <span>{userData?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              {/* <IconPhone size={16} /> */}
              <span>{userData?.position}</span>
            </div>
          </div>
        </section>

        {isOwner && (
          <div className="flex flex-col gap-4">
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

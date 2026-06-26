"use client";

import { useRouter } from "next/navigation";
import { HeaderComponent } from "@/components/ui/header";
import SubTitle from "@/components/ui/sub-title";

const page = () => {
  const router = useRouter();
  return (
    <div className="h-full w-full px-3">
      <div className="px-2 pb-6 sm:pb-13">
        <HeaderComponent Header={"Settings"} />
      </div>

      <div>
        <SubTitle
          HeaderText="System Settings"
          title="Slot rules, pricing, payment/UPI settings"
          description="Configure system-wide settings such as default service durations,
            pricing multipliers, and operational parameters."
          buttonText="Configure"
        />
      </div>

      <div>
        <SubTitle
          HeaderText="Team Roles and Access"
          title="Role management, permission grid, logs"
          description="Manage user roles and permissions within the application, defining access levels for different user groups."
          buttonText="Manage"
        />
      </div>

      <div>
        <SubTitle
          HeaderText="API & Integration"
          title="WhatsApp API, webhooks, external integration"
          description="Manage integrations with third-party services, such as payment gateways, mapping services, and communication platforms."
          buttonText="Manage"
        />
      </div>

      <div>
        <SubTitle
          HeaderText="Audit Logs"
          title="Manual overrides, errors, payment issues"
          description="Configure notification settings for various events, such as order updates, service reminders, and system alerts."
          buttonText="Configure"
        />
      </div>

      <div>
        <SubTitle
          HeaderText="Subscriptions & Loyalty"
          title="Subscription & Loyalty Management"
          description="Manage customer subscriptions and loyalty programs, including discounts, rewards, and membership tiers."
          buttonText="Manage"
          onClick={() => router.push("/settings/subscription-loyalty")}
        />
      </div>
    </div>
  );
};

export default page;

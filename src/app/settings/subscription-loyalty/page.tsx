"use client";
import { HeaderComponent } from "@/components/ui/header";
import { StarIcon } from "@/components/icons/StarIcon";
import { QuestionMarkIcon } from "@/components/icons/QuestionMark";
import SubTitle from "@/components/ui/sub-title";
import {
  ExclusiveButton,
  TransparentButton,
  XnoxButton,
} from "@/components/ui/button";
import { useState } from "react";
import PlanCard from "@/components/ui/PlanCard";
import CreatePlanModal from "@/components/models/CreatePlanModal";

const page = () => {
  const [showModal, setShowModal] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  const handleAddPlan = (plan: {
    title: string;
    description: string;
    image: string;
  }) => {
    setPlans((prev: any) => [...prev, plan]);
  };

  return (
    <div className="w-full h-full px-2">
      <div className="pl-3 pb-5">
        <span className="text-bold">Settings/</span>
        <span>Subcriptions & Loyalty</span>
      </div>

      <div className="flex flex-col pb-10">
        <HeaderComponent Header={"Subscriptions & Loyalty"} />

        <span className="mytext mt-3 pl-2 text-[#70707A]">
          Manage your subscriptions and loyalty points
        </span>
      </div>

      <div className="space-grotesk text-2xl pl-2 pb-5">Loyalty Points</div>

      <div className="flex gap-x-3 mb-7">
        <div className="flex gap-x-3">
          <span className="flex pl-2 justify-center items-center">
            <StarIcon />
          </span>

          <span className="flex flex-col">
            <span className="space-grotesk text-[#121417] leading-5">
              Total Points
            </span>
            <span className="font-medium text-[#70707A] leading-5">
              100 points
            </span>
          </span>
        </div>

        <div className="flex gap-x-3">
          <span className="flex pl-2 items-center">
            <QuestionMarkIcon />
          </span>

          <span className="flex flex-col">
            <span className="space-grotesk  text-[#121417] leading-5">
              How to Earn Points
            </span>
            <span className="font-medium text-[#70707A] leading-5">
              Earn 1 point for every ₹1 spent
            </span>
          </span>
        </div>

        <div className="flex gap-x-3">
          <span className="flex pl-2 items-center">
            <QuestionMarkIcon />
          </span>

          <span className="flex flex-col justify-center">
            <span className="space-grotesk text-[#121417] leading-5">
              How to Redeem Points
            </span>
            <span className="font-medium text-[#70707A] leading-5">
              Redeem points for discounts on washes
            </span>
          </span>
        </div>
      </div>

      <div className="px-2 flex justify-between">
        <span className="text-2xl font-bold">Plans</span>
        <span>
          <ExclusiveButton
            Text="Create a new plan"
            className="border mr-8 px-4 py-2 flex rounded-md bg-[#3241B3] text-[#fafafa] font-semibold"
            onClick={() => setShowModal(true)}  
          />
        </span>
      </div>

      <div className="flex mt-2 ml-2 gap-x-3">
        <XnoxButton Text="Filter by expiry" />
        <XnoxButton Text="Auto-renewal" />
      </div>

      {/* Cards Section */}
      <div className="flex flex-wrap gap-5 mt-5 ml-2">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            title={plan.title}
            description={plan.description}
            image={plan.image}
            onModify={() => alert(`Modify ${plan.title}`)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <CreatePlanModal
          onClose={() => setShowModal(false)}
          onSave={handleAddPlan}
        />
      )}
    </div>
  );
};

export default page;

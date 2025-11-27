"use client";

import PageHeader from "@/components/layout/PageHeader";
import { useParams } from "next/navigation";
import PageFooter from "@/components/layout/PageFooter";
import { useActorDataByID } from "@/hooks/useData/useActorsData";
import { LoadingPage } from "@/components/ui/LoadingPage";
import NotFoundDiv from "@/components/ui/NotFoundDiv";

export default function TypePage() {
  const params = useParams(); // Lấy dynamic route params
  const actor = params.actor; // Lấy giá trị của [type]

  const {actor: actorInfo, movies, loading} = useActorDataByID(actor?.toString() || "");

  if (loading) {
    return (
      <div className="max-w-[2000px]">
        <LoadingPage />
      </div>
    );
  }

  if (!actorInfo) {
    return (
      <div className="max-w-[2000px]">
        <PageHeader />
        <NotFoundDiv message="Không tìm thấy diễn viên" />
        <PageFooter />
      </div>
    );
  }

  return (
    <div className="max-w-[2000px]">
      <PageHeader />
      <div className="grid grid-cols-2">
        <div className="p-4 max-w-[30vw]">
          <h1 className="text-3xl font-bold mb-4">{actorInfo.originName}</h1>
          <div className="mb-4">
            <img
              src={actorInfo.profilePath}
              alt={actorInfo.originName}
              className="w-48 h-auto rounded"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Thông tin diễn viên</h2>
            <p><strong>Tên gốc:</strong> {actorInfo.originName}</p>
            <p><strong>Tên khác:</strong> 
              {actorInfo.alsoKnownAs?.map((name, index) => (
                <span key={index}>
                  {name}
                </span>
                )) || " N/A"}
              </p>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
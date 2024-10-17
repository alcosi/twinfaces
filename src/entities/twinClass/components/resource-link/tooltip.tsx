import { Separator } from "@/components/base/separator";
import { TwinClass } from "@/lib/api/api-types";
import {
  Check,
  Clock,
  Copy,
  LayoutTemplate,
  Link,
  LoaderCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFetchTwinClassById } from "../../hooks";

type Props = {
  data: TwinClass;
};

export const TwinClassResourceTooltip = ({ data }: Props) => {
  const { fetchTwinClassById } = useFetchTwinClassById();
  const [twinClassData, setTwinClassData] = useState<TwinClass>(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (data.id && !data.key) {
        setLoading(true);
        try {
          const fetchedData = await fetchTwinClassById(data.id);
          setTwinClassData((prev) => fetchedData ?? prev);
        } catch (error) {
          console.error("Error fetching twin class data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [data.id, data.key, fetchTwinClassById]);

  const handleCopyUUID = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const baseUrl = window?.location.origin ?? "";
    const link = `${baseUrl}/twinclass/${data.id}`;

    navigator.clipboard.writeText(link).then(() => {
      toast.message("Link is copied");
    });
  };

  return (
    <div className="p-2 text-sm">
      {loading ? (
        <div className="flex justify-center items-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-1">
            <div className="flex flex-row gap-2 items-center">
              <LayoutTemplate className="h-4 w-4" />
              {twinClassData.name
                ? twinClassData.name
                : (twinClassData.key ?? "N/A")}
              {twinClassData.abstractClass && <Check className="h-4 w-4" />}
            </div>
            {twinClassData.description && <p>{twinClassData.description}</p>}
            {twinClassData.extendsClass && (
              <div>
                <strong>Extends: </strong>
                {twinClassData.extendsClass.key}
              </div>
            )}
            {twinClassData.headClassId && (
              <div>
                <strong>Head Class ID: </strong>
                {twinClassData.headClassId}
              </div>
            )}
            {twinClassData.createdAt && (
              <div className="flex flex-row gap-2 items-center">
                <Clock className="h-4 w-4" />
                {new Date(twinClassData.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <Separator className="my-2" />

          <button
            className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
            onClick={handleCopyUUID}
          >
            <Copy className="h-4 w-4" />
            Copy UUID
          </button>
          <button
            className="flex flex-row gap-2 items-center hover:bg-secondary w-full p-0.5"
            onClick={handleCopyLink}
          >
            <Link className="h-4 w-4" />
            Copy Link
          </button>
        </>
      )}
    </div>
  );
};

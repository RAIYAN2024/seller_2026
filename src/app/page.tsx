"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Select } from "@/components/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyLabel } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import ImageUploader from "./img/page";
import { UploadImage } from "./img/types";
import { Button } from "@/components/ui/button";
export default function Home() {
  const [connectivity, setConnectivity] = useState<string>("");
  const [file, setFile] = useState<UploadImage[]>([
    {
      id: "1",
      file: new File([], "sample.jpg"),
      preview:
        "https://img.lazcdn.com/us/domino/c4ff8297-21fe-447c-a1ad-131ba389c8d5_BD-1976-688.jpg_2200x2200q80.jpg_.avif",
    },
  ]);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Submitting form with connectivity:",
      connectivity,
      "and files:",
      file
    );
  };
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="md:mx-4 p-2">
            <Card>
              <CardHeader>
                <CardTitle>Specification</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit}>
                  <EmptyLabel required>Connectivity</EmptyLabel>
                  <Select
                    value={connectivity}
                    onChange={setConnectivity}
                    options={[
                      { label: "2G", value: "2g" },
                      { label: "3G", value: "3g" },
                      { label: "4G", value: "4g" },
                      { label: "5G", value: "5g" },
                      { label: "Wifi", value: "wifi" },
                      { label: "BlueTooth", value: "bluetooth" },
                      {
                        label: "Headphone Jack 3.5mm",
                        value: "headphone jack 3.5mm",
                      },
                      { label: "IR blaster", value: "ir blaster" },
                    ]}
                  />

                  <ImageUploader max={8} value={file} onChange={setFile} />
                  <Button>Upload</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

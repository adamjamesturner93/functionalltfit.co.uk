import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BodyMeasurementForm } from "./body-measurement-form";
import { BodyMeasurementGraph } from "../components/body-measurement-graph";
import { getBodyMeasurements } from "@/app/actions/health";

export default async function BodyMeasurementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bodyMeasurements = await getBodyMeasurements(session.user.id, 365); // Get last year of data

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Weekly Body Measurements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BodyMeasurementForm />
        <BodyMeasurementGraph data={bodyMeasurements} />
      </div>
    </div>
  );
}

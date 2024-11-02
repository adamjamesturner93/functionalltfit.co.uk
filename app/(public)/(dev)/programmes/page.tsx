import { getProgrammes } from "@/app/actions/programmes";
import Link from "next/link";
import Image from "next/image";

export default async function ProgrammesPage() {
  const programmes = await getProgrammes();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Programmes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((programme) => (
          <Link
            href={`/programmes/${programme.id}`}
            key={programme.id}
            className="block"
          >
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Image
                src={programme.thumbnail}
                alt={programme.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {programme.title}
                </h2>
                <p className="text-gray-600 mb-2">{programme.intention}</p>
                <p className="text-sm text-bg-surface-light-grey0">
                  {programme.sessionsPerWeek} sessions per week
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

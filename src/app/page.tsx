import { lightFormat, startOfMonth } from "date-fns";
import { prisma } from "../../prisma/prisma";
import { redirect } from "next/navigation";

import LoginForm from "@/components/forms/LoginForm";

import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (user)
      return redirect(
        `/month/${lightFormat(startOfMonth(new Date()), "yyyy-MM-dd")}`
      );
  }

  return <LoginForm />;
}

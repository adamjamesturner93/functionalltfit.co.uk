"use client";

import React from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser } from "@/app/admin/actions/users";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

interface MembersTableProps {
  members: User[];
}

export function MembersTable({ members }: MembersTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteUser(id);
        toast({ title: "Member deleted successfully" });
        router.refresh();
      } catch (error) {
        console.error(error);
        toast({ title: "Error deleting member", variant: "destructive" });
      }
    }
  };

  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  return (
    <div>
      {(status || plan) && status !== "ALL" && plan !== "ALL" && (
        <div className="mb-4 text-sm text-muted-foreground">
          Filtered by:{" "}
          {status && status !== "ALL" && (
            <span className="mr-2">Status: {status}</span>
          )}
          {plan && plan !== "ALL" && <span>Plan: {plan}</span>}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{`${member.name}`}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.membershipStatus}</TableCell>
              <TableCell>{member.membershipPlan}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/users/${member.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

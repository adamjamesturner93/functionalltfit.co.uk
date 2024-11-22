'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function MailingListPopup() {
  const [showMailingListPopup, setShowMailingListPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMailingListPopup(true);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={showMailingListPopup} onOpenChange={setShowMailingListPopup}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Our Mailing List</DialogTitle>
          <DialogDescription>
            Sign up to receive exclusive fitness tips, early access to new features, and special
            offers!
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Unit } from '@prisma/client';

import { ProfileFormValues, updateProfile } from '@/app/actions/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { profileSchema } from '@/lib/schemas/profile';

interface ProfileFormProps {
  user: ProfileFormValues & { id: string };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [profileImage, setProfileImage] = useState(user.image || '/placeholder.svg');

  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      lengthUnit: user.lengthUnit,
      weightUnit: user.weightUnit,
      image: user.image,
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.url) {
          setProfileImage(data.url);
          toast({
            title: 'Success',
            description: 'Profile image updated successfully',
          });
        } else {
          throw new Error(data.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload profile image',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('profileImage', profileImage);

    const result = await updateProfile(formData);
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    }
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="size-20">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <Label
                    htmlFor="picture"
                    className="cursor-pointer text-sm font-medium text-primary hover:underline"
                  >
                    {isUploading ? 'Uploading...' : 'Change profile picture'}
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lengthUnit">Length Unit</Label>
                <Controller
                  name="lengthUnit"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Unit).map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit === Unit.METRIC ? 'Metric (cm, m, km)' : 'Imperial (in, ft, mi)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.lengthUnit && (
                  <p className="text-sm text-red-500">{errors.lengthUnit.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Weight Unit</Label>
                <Controller
                  name="weightUnit"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Unit).map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit === Unit.METRIC ? 'Kilograms (kg)' : 'Pounds (lbs)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.weightUnit && (
                  <p className="text-sm text-red-500">{errors.weightUnit.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Health App Connections</CardTitle>
              <CardDescription>Connect your fitness tracking apps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Garmin Connect</Label>
                  <p className="text-sm text-muted-foreground">Sync your Garmin device data</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Google Fit</Label>
                  <p className="text-sm text-muted-foreground">Connect with Google Fit</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <div className="mt-6">
          <Button type="submit">Save All Changes</Button>
        </div>
      </form>
    </Tabs>
  );
}

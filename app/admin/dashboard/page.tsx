'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  FileText,
  Code,
  BookOpen,
  Award,
  Calendar,
  FileCheck,
  Wrench,
  User,
  LogOut,
  Star,
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { user } = await getUser();
      if (!user) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await signOut();
    router.push('/admin');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const sections = [
    {
      title: 'Profile',
      icon: User,
      href: '/admin/dashboard/profile',
      description: 'Manage your profile information',
    },
    {
      title: 'Blogs',
      icon: FileText,
      href: '/admin/dashboard/blogs',
      description: 'Create and manage blog posts',
    },
    {
      title: 'Projects',
      icon: Code,
      href: '/admin/dashboard/projects',
      description: 'Add and edit projects',
    },
    {
      title: 'Research',
      icon: BookOpen,
      href: '/admin/dashboard/research',
      description: 'Manage research publications',
    },
    {
      title: 'Highlights',
      icon: Star,
      href: '/admin/dashboard/highlights',
      description: 'Manage homepage highlights',
    },

    {
      title: 'Achievements',
      icon: Award,
      href: '/admin/dashboard/achievements',
      description: 'Add awards and recognition',
    },
    {
      title: 'Conferences',
      icon: Calendar,
      href: '/admin/dashboard/conferences',
      description: 'Track conference participation',
    },
    {
      title: 'Certifications',
      icon: FileCheck,
      href: '/admin/dashboard/certifications',
      description: 'Manage certificates and documents',
    },
    {
      title: 'Skills',
      icon: Wrench,
      href: '/admin/dashboard/skills',
      description: 'Update your skills',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your portfolio content</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <section.icon className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

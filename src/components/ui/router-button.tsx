"use client";

import { Button } from './button'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/navigation';

export function RouterButton() {
  const router = useRouter();

  return (
    <Button
        variant="secondary"
        leftIcon={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
      >
        Back to previous page
      </Button>
  )
}

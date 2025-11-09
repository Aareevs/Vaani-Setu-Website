import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

function Skeleton({ className, children }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      data-slot="skeleton"
      className={cn("bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md", className)}
    >
      {children}
    </motion.div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-3/5 h-5 rounded mb-2" />
          <Skeleton className="w-2/5 h-3.5 rounded" />
        </div>
      </div>
      <Skeleton className="w-full h-4 rounded mb-2" />
      <Skeleton className="w-4/5 h-4 rounded" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="w-24 h-3.5 rounded mb-2" />
                <Skeleton className="w-16 h-6 rounded" />
              </div>
              <Skeleton className="w-10 h-10 rounded" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <Skeleton className="w-32 h-5 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-3/5 h-4 rounded mb-1" />
                    <Skeleton className="w-2/5 h-3.5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <Skeleton className="w-24 h-5 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-8 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-3/5 h-5 rounded mb-2" />
              <Skeleton className="w-4/5 h-3.5 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ButtonSkeleton() {
  return (
    <Skeleton className="w-32 h-10 rounded-lg" />
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="w-24 h-3.5 rounded mb-2" />
          <Skeleton className="w-full h-10 rounded" />
        </div>
      ))}
      <Skeleton className="w-32 h-10 rounded mt-4" />
    </div>
  );
}

export { Skeleton };

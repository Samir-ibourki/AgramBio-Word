import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-[30px] lg:rounded-[40px] p-2 lg:p-4 border border-black/5 shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-100 rounded-[25px] lg:rounded-[35px] mb-4 overflow-hidden relative">
        <div className="absolute inset-0 animate-shimmer" />
    </div>
    <div className="px-2 space-y-3 pb-2">
      <div className="h-2 w-16 bg-gray-100 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-4 w-3/4 bg-gray-100 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="h-4 w-1/2 bg-gray-100 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="aspect-3/3 md:aspect-4/5 rounded-xl md:rounded-2xl bg-gray-100 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 animate-shimmer" />
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-white/20 rounded-full blur-[1px]" />
  </div>
);

export const SkeletonGrid = ({ type = 'product', count = 4, gridClass = "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8" }) => {
  return (
    <div className={gridClass}>
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>
          {type === 'product' ? <ProductSkeleton /> : <CategorySkeleton />}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl lg:max-w-[95vw] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start py-10 animate-pulse">
    <div className="lg:col-span-5">
      <div className="aspect-square bg-gray-100 rounded-[40px] relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
    <div className="lg:col-span-7 space-y-8">
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-100 rounded-full relative overflow-hidden">
           <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="h-12 w-3/4 bg-gray-100 rounded-2xl relative overflow-hidden">
           <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="h-8 w-40 bg-gray-100 rounded-xl relative overflow-hidden">
           <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
      <div className="space-y-4 pt-10">
        <div className="h-4 w-full bg-gray-100 rounded-full relative overflow-hidden">
           <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="h-4 w-5/6 bg-gray-100 rounded-full relative overflow-hidden">
           <div className="absolute inset-0 animate-shimmer" />
        </div>
        <div className="h-4 w-4/6 bg-gray-100 rounded-full relative overflow-hidden">
           <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

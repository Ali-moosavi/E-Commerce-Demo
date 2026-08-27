export type PRODUCT_PROPERTY_TYPE = {
  id: number
  propertyId: number
  filterId?: number
  type?: string
  optionId?: number
  name: string
  nameFa: string
  displayType: 'color' | 'text'
  value: string
  valueFa: string
  metadata?: FILTER_OPTION_METADATA
}
export type FILTER_OPTION_METADATA = {
  hex?: string
}

export type PRODUCT_COLOR_TYPE = {
  name: string
  hex: string
  selected?: boolean
}

export type PRODUCT_DETAIL_ITEM_TYPE = {
  label: string
  value: string
}

export type PRODUCT_SELLER_TYPE = {
  name: string
  satisfactionRate: string
  performance: string
  warranty: string
  inventoryStatus: string
  shippingMethods: string[]
  otherSellerCount: number
  remainingStock: number
  clubPoints: number
}

export type PRODUCT_REVIEW_TYPE = {
  id: number
  recommendation: string
  text: string
  author: string
  isBuyer: boolean
  helpfulCount: number
}

export type PRODUCT_QUESTION_TYPE = {
  id: number
  text: string
  answerCount: number
}

export type PRODUCT_PAGE_DETAILS_TYPE = {
  brandName: string
  productGroup: string
  ratingCount: number
  commentCount: number
  questionCount: number
  colors: PRODUCT_COLOR_TYPE[]
  featureHighlights: PRODUCT_DETAIL_ITEM_TYPE[]
  seller: PRODUCT_SELLER_TYPE
  currency: string
  returnPolicy: string
  introduction: string
  expertReviewImage?: string
  expertReviewText?: string
  specifications: PRODUCT_DETAIL_ITEM_TYPE[]
  reviews: PRODUCT_REVIEW_TYPE[]
  questions: PRODUCT_QUESTION_TYPE[]
}

export type PRODUCT_TYPE = {
  id: number
  name: string
  describtion: string
  Categoryid: number
  price: string
  rate: string
  image: string[]
  badge: string
  /** raw filter-option ids this product matches, e.g. [2, 19, 26] */
  propertyIds: number[]
  /** propertyIds already resolved against /filters — use this for display */
  properties: PRODUCT_PROPERTY_TYPE[]
  pageDetails?: PRODUCT_PAGE_DETAILS_TYPE
}
export type CATEGORY_TYPE = {
  name: string
  categoryid?: number
  id?: number
  parentcategoryid?: number
  children?: CATEGORY_TYPE[]
  products?: PRODUCT_TYPE[]
}

export interface MOBILEDATA {
  name: string;
  describtion: string;
  Categoryid: number;
  id: number;
  price: string;
  rate: string;
  image: string[];
  badge?: string;
  properties?: PRODUCT_PROPERTY_TYPE[];
  propertyValueIds?: number[];
  propertyIds?: number[];
  pageDetails?: PRODUCT_PAGE_DETAILS_TYPE;
}

export type SUCCES_PROPERTIES_TYPE = {
  filterId: number
  type: string
  name: string
  nameFa: string
  displayType: FILTER_DISPLAY_TYPE
  options: PROPERTIES_OPTIONS_TYPE[]
}
export type FILTER_DISPLAY_TYPE = 'color' | 'text'

export type PROPERTIES_OPTIONS_TYPE ={
  id: number
  value: string
  valueFa: string
  metadata?: FILTER_OPTION_METADATA
}
export type ProductProperty = {
  id: number;
  propertyId: number;
  name: string;
  nameFa: string;
  displayType: 'color' | 'text';
  value: string;
  valueFa: string;
  metadata?: {
    hex?: string;
  };
};

export type ProductColor = {
  name: string;
  hex: string;
  selected?: boolean;
};

export type ProductDetailItem = {
  label: string;
  value: string;
};

export type ProductSeller = {
  name: string;
  satisfactionRate: string;
  performance: string;
  warranty: string;
  inventoryStatus: string;
  shippingMethods: string[];
  otherSellerCount: number;
  remainingStock: number;
  clubPoints: number;
};

export type ProductReview = {
  id: number;
  recommendation: string;
  text: string;
  author: string;
  isBuyer: boolean;
  helpfulCount: number;
};

export type ProductQuestion = {
  id: number;
  text: string;
  answerCount: number;
};

export type ProductPageDetails = {
  brandName: string;
  productGroup: string;
  ratingCount: number;
  commentCount: number;
  questionCount: number;
  colors: ProductColor[];
  featureHighlights: ProductDetailItem[];
  seller: ProductSeller;
  currency: string;
  returnPolicy: string;
  introduction: string;
  expertReviewImage?: string;
  expertReviewText?: string;
  specifications: ProductDetailItem[];
  reviews: ProductReview[];
  questions: ProductQuestion[];
};

export type Product = {
  id: number;
  name: string;
  describtion: string;
  Categoryid: number;
  price: string;
  rate: string;
  image: string[];
  badge?: string;
  properties?: ProductProperty[];
  propertyValueIds?: number[];
  propertyIds?: number[];
  pageDetails?: ProductPageDetails;
};

export type PropertyValue = {
  id: number;
  propertyId: number;
  name: string;
  nameFa: string;
  metadata?: {
    hex?: string;
  };
  productCount?: number;
};

export type ProductPropertyGroup = {
  id: number;
  name: string;
  nameFa: string;
  displayType: 'color' | 'text';
  values?: PropertyValue[];
};

export type ProductCategoryChild = {
  name: string;
  parentcategoryid: number;
  id: number;
  children: ProductCategoryChild[];
  products?: Product[];
};

export type ProductCategory = {
  name: string;
  categoryid: number;
  children: ProductCategoryChild[];
};

export type SUCCES_PRODUCTS_TYPE = ProductCategory[];

export type REQUEST_STATUS = 'idle' | 'loading' | 'succeeded' | 'failed';

export type INITIALSTATES = {
  products: SUCCES_PRODUCTS_TYPE;
  filteredItems:number[];
  status: REQUEST_STATUS;
};


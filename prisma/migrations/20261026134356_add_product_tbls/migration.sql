-- CreateTable
CREATE TABLE "categories" (
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "child_category" (
    "child_category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentcategoryid" TEXT NOT NULL,

    CONSTRAINT "child_category_pkey" PRIMARY KEY ("child_category_id")
);

-- CreateTable
CREATE TABLE "grand_child_category" (
    "grand_child_category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_category_id" TEXT NOT NULL,

    CONSTRAINT "grand_child_category_pkey" PRIMARY KEY ("grand_child_category_id")
);

-- CreateTable
CREATE TABLE "grandChildProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "rate" DECIMAL(2,1) NOT NULL,
    "images" TEXT[],
    "badge" TEXT,

    CONSTRAINT "grandChildProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productsproperty" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,

    CONSTRAINT "productsproperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "propertyCategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("propertyCategoryId")
);

-- CreateTable
CREATE TABLE "propertiesOption" (
    "option_id" TEXT NOT NULL,
    "parent_property_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_fa" TEXT NOT NULL,

    CONSTRAINT "propertiesOption_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "pageDetails" (
    "id" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "product_group" TEXT NOT NULL,
    "rating_count" INTEGER NOT NULL,
    "comment_count" INTEGER NOT NULL,
    "question_count" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "expert_review" TEXT NOT NULL,

    CONSTRAINT "pageDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "featureHighlights" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "featureHighlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specifications" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "specifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "child_category_parentcategoryid_idx" ON "child_category"("parentcategoryid");

-- CreateIndex
CREATE INDEX "grand_child_category_parent_category_id_idx" ON "grand_child_category"("parent_category_id");

-- AddForeignKey
ALTER TABLE "child_category" ADD CONSTRAINT "child_category_parentcategoryid_fkey" FOREIGN KEY ("parentcategoryid") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grand_child_category" ADD CONSTRAINT "grand_child_category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "child_category"("child_category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grandChildProduct" ADD CONSTRAINT "grandChildProduct_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "grand_child_category"("grand_child_category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productsproperty" ADD CONSTRAINT "productsproperty_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "grandChildProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productsproperty" ADD CONSTRAINT "productsproperty_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "propertiesOption"("option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propertiesOption" ADD CONSTRAINT "propertiesOption_parent_property_id_fkey" FOREIGN KEY ("parent_property_id") REFERENCES "properties"("propertyCategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pageDetails" ADD CONSTRAINT "pageDetails_id_fkey" FOREIGN KEY ("id") REFERENCES "grandChildProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "featureHighlights" ADD CONSTRAINT "featureHighlights_id_fkey" FOREIGN KEY ("id") REFERENCES "pageDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specifications" ADD CONSTRAINT "specifications_id_fkey" FOREIGN KEY ("id") REFERENCES "pageDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

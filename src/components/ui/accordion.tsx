import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("overflow-visible border-b border-[#ececec] bg-white transition-colors", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex w-full flex-1 items-center justify-between gap-3 px-4 py-3 text-right text-[15px] font-medium text-[#2f2f2f] transition-all outline-none hover:bg-[#f5f5f5] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:px-4",
          className
        )}
        {...props}
      >
        <span className="flex flex-1 items-center justify-between gap-3">
          {children}
        </span>
        <span className="flex items-center justify-center text-[#707070] cursor-pointer">
          <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none cursor-pointer size-4 group-aria-expanded/accordion-trigger:hidden" />
          <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden size-4  group-aria-expanded/accordion-trigger:inline" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm text-[#4b5563] data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) border-t border-[#f0f0f0] bg-white px-3 pb-3 pt-3 data-ending-style:h-0 data-starting-style:h-0",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }


import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SidebarContextType = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

export function Sidebar({
  children,
  className,
  defaultCollapsed = false,
}: SidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-14" : "w-64",
        className
      )}
    >
      <nav className="flex flex-col h-full">{children}</nav>
    </aside>
  );
}

export function SidebarContent({ children }: { children?: React.ReactNode }) {
  return <div className="flex-1">{children}</div>;
}

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="h-14 flex items-center px-4 border-b border-sidebar-border">
      {children}
    </header>
  );
}

export function SidebarFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="h-14 flex items-center px-4 border-t border-sidebar-border">
      {children}
    </footer>
  );
}

export function SidebarTrigger() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
    >
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
}

export function SidebarGroup({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("py-2", className)}>{children}</div>;
}

export function SidebarGroupLabel({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return null;
  }

  return (
    <div
      className={cn(
        "px-4 py-1 text-xs font-medium text-sidebar-foreground/70",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-2", className)}>{children}</div>;
}

export function SidebarMenu({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

export function SidebarMenuItem({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <li className={className}>{children}</li>;
}

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  asChild?: boolean;
}

export function SidebarMenuButton({
  active,
  className,
  children,
  asChild,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed } = useSidebar();
  const Element = asChild ? "div" : "button";

  return (
    //@ts-ignore
    <Element
      className={cn(
        "flex items-center py-2 w-full text-sm font-medium rounded-md",
        collapsed ? "justify-center px-2" : "px-3",
        active
          ? "text-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {typeof children === "function"
        ? children({ collapsed })
        : collapsed
        ? // If children is not a function and sidebar is collapsed,
          // assume the first child is the icon
          React.Children.toArray(children)[0]
        : children}
    </Element>
  );
}

export function SidebarUser({
  name,
  email,
  avatar,
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  name: string;
  email?: string;
  avatar?: string;
}) {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return (
      <div
        className="flex items-center justify-center h-14"
        {...props}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 h-14",
        className
      )}
      {...props}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-sidebar-foreground">
          {name}
        </span>
        {email && (
          <span className="text-xs text-sidebar-foreground/70">{email}</span>
        )}
      </div>
    </div>
  );
}

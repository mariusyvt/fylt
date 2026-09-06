import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    leading?: ReactNode;
    action?: ReactNode;
    children?: ReactNode;
}

export default function PageHeader({
    title,
    eyebrow,
    subtitle,
    leading,
    action,
    children,
}: PageHeaderProps) {
    const hasBar = Boolean(leading || action);

    return (
        <header className="page-header">
            {hasBar && (
                <div className="page-header__bar">
                    <div className="page-header__leading">{leading}</div>
                    {action && <div className="page-header__action">{action}</div>}
                </div>
            )}

            <div className="page-header__titles">
                {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
                <h1 className="page-header__title">{title}</h1>
                {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>

            {children && <div className="page-header__extra">{children}</div>}
        </header>
    );
}

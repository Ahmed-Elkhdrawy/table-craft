import React from 'react'
import { Download, Edit, Eye, MoreVertical, Trash2Icon, XCircle } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useTableTranslations } from '../hooks/use-table-translations'
import { useTableConfig } from '../config'

export interface CustomButtonProps {
  text?: string
  function?: () => void
  className?: string
  icon?: React.ReactElement
  attr?: any
  children?: React.ReactNode
  toolTip?: string
}

export interface MoreActionsProps {
  text?: string
  function?: () => void
  icon?: React.ReactElement
  disabled?: boolean
  attr?: any
  toolTip?: string
}

interface CommonActionProps {
  action?: () => void
  disabled?: boolean
  tooltip?: string
}

interface Props {
  editAction?: CommonActionProps
  showAction?: CommonActionProps
  deleteAction?: CommonActionProps
  cancelAction?: CommonActionProps
  downloadAction?: CommonActionProps
  className?: string
  customButtons?: CustomButtonProps[] | React.ReactElement
  text?: string
  dropMoreActions?: MoreActionsProps[]
  useDropdown?: boolean
}

export const ButtonTooltip = ({ content }: { content: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="absolute inset-0" />
      </TooltipTrigger>
      <TooltipContent className="max-w-96 text-wrap">{content}</TooltipContent>
    </Tooltip>
  )
}

const ActionButton = ({
  onClick,
  disabled,
  className,
  icon,
  tooltip,
  variant = 'default',
}: {
  onClick?: () => void
  disabled?: boolean
  className: string
  icon: React.ReactNode
  tooltip?: string
  variant?: 'default' | 'ghost'
}) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      variant={variant}
      className={`relative ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {icon}
      {tooltip && <ButtonTooltip content={tooltip} />}
    </Button>
  )
}

const TableActionsRow = ({
  editAction,
  showAction,
  deleteAction,
  downloadAction,
  className,
  customButtons,
  text,
  dropMoreActions,
  useDropdown = true,
  cancelAction,
}: Props) => {
  const t = useTableTranslations()
  const config = useTableConfig()
  const isArabic = config.i18n.direction === 'rtl' || (config.i18n.direction === 'auto' && config.i18n.locale === 'ar')

  const commonActions = [
    editAction && {
      text: t('edit'),
      icon: <Edit className="text-tab-teal size-4" />,
      function: editAction.action,
      disabled: editAction.disabled,
      className: 'bg-tab-teal hover:bg-tab-teal-800',
      tooltip: t('edit'),
    },
    showAction && {
      text: t('show'),
      icon: <Eye className="size-4" />,
      function: showAction.action,
      disabled: showAction.disabled,
      className: 'bg-tab-turquoise hover:bg-tab-turquoise-800',
      tooltip: t('show'),
    },
    downloadAction && {
      text: t('download'),
      icon: <Download className="text-main size-4" />,
      function: downloadAction.action,
      disabled: downloadAction.disabled,
      className: 'outline outline-1 outline-main',
      tooltip: t('download'),
      variant: 'ghost' as const,
    },
    deleteAction && {
      text: t('delete'),
      icon: <Trash2Icon className="size-4 text-rose-700" />,
      function: deleteAction.action,
      disabled: deleteAction.disabled,
      className: 'outline outline-1 outline-rose-700',
      tooltip: t('delete'),
      variant: 'ghost' as const,
    },
    cancelAction && {
      text: t('cancel'),
      icon: <XCircle className="size-4 text-rose-600" />,
      function: cancelAction.action,
      disabled: cancelAction.disabled,
      className: 'outline outline-1 outline-rose-600',
      tooltip: cancelAction.tooltip || t('cancel'),
      variant: 'ghost' as const,
    },
  ].filter(Boolean)

  const renderActionButtons = () => {
    if (useDropdown) {
      return (
        <DropdownMenu dir={isArabic ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {commonActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  disabled={action?.disabled}
                  className="flex !justify-between"
                  onClick={action?.function}
                >
                  <span>{action?.text}</span>
                  <DropdownMenuShortcut>{action?.icon}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              {dropMoreActions?.map((item, index) => (
                <DropdownMenuItem
                  key={`more-${index}`}
                  disabled={item.disabled}
                  className="flex !justify-between"
                  onClick={item.function}
                  {...item?.attr}
                >
                  <span>{item.text}</span>
                  <DropdownMenuShortcut>{item.icon}</DropdownMenuShortcut>
                  {item.toolTip && <ButtonTooltip content={item.toolTip} />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <>
        {commonActions.map((action, index) => (
          <ActionButton
            key={index}
            onClick={action?.function}
            disabled={action?.disabled}
            className={action?.className || ''}
            icon={action?.icon}
            tooltip={action?.tooltip}
            variant={action?.variant}
          />
        ))}
      </>
    )
  }

  return (
    <div className={`${className} flex flex-row items-center gap-1 text-center md:gap-3`}>
      {renderActionButtons()}

      {customButtons && Array.isArray(customButtons)
        ? customButtons
            .filter((customButton) => Object.keys(customButton).length !== 0)
            .map((customButton, index) => (
              <Button
                key={index}
                onClick={customButton?.function}
                className={`${customButton.className || ''} relative flex justify-center gap-2`}
                {...customButton.attr}
              >
                {customButton.toolTip && <ButtonTooltip content={customButton.toolTip} />}
                {customButton.text}
                {customButton.icon}
                {customButton.children}
              </Button>
            ))
        : React.isValidElement(customButtons)
          ? customButtons
          : null}

      {text && <span>{text}</span>}

      {!useDropdown && dropMoreActions && (
        <DropdownMenu dir={isArabic ? 'rtl' : 'ltr'}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {dropMoreActions
                .filter((action) => Object.keys(action).length !== 0)
                .map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    disabled={item.disabled}
                    className="flex !justify-between"
                    onClick={item.function}
                  >
                    <span>{item.text}</span>
                    <DropdownMenuShortcut>{item.icon}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default TableActionsRow

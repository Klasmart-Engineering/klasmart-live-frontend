import { Tooltip } from "@material-ui/core";
import React, { ReactElement } from "react"
import { useIntl } from "react-intl";
  interface TooltipIntlProps {
    id: string;
    children: ReactElement;
  }
  
  function TooltipIntl ({ id, children }: TooltipIntlProps) {
      const intl = useIntl();
  
      return (
          <Tooltip title={intl.formatMessage({
              id: id,
          })}
          >
              {children}
          </Tooltip>
      );
  }
  
  export { TooltipIntl };
  
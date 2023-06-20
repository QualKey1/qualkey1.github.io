import { Scope , Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import * as Sentry from "@sentry/node";
import { Span, SpanContext } from "@sentry/types";
import { Request } from "express";

/**
 * Sentry is the service which keeps track of errors
 *
 * Because we inject REQUEST we need to set the service as request scoped
 */
@Injectable({ scope: Scope.REQUEST })
export class SentryService {
  /**
     * Return the current span defined in the current Hub and Scope
     */
  get span(): Span {
    return Sentry.getCurrentHub().getScope().getSpan();
  }

  /**
     * When injecting the service it will create the main transaction
     */
  constructor(@Inject(REQUEST) private request: Request) {
    const { method, headers, url } = this.request;

    // recreate transaction based from HTTP request
    const transaction = Sentry.startTransaction({
      name: `Route: ${method} ${url}`,
      op: "transaction",
    });

    // setup context of newly created transaction
    Sentry.getCurrentHub().configureScope((scope) => {
      scope.setSpan(transaction);

      scope.setContext("https", {
        method,
        url,
        headers,
      });
    });
  }

  /**
     * This will simply start a new child span in the current span
     */
  startChild(spanContext: SpanContext): any {
    return this.span.startChild(spanContext);
  }
}

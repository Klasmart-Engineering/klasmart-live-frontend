#import "ExternalUrlIntercept.h"

#define CDVWebViewNavigationTypeLinkClicked 0
#define CDVWebViewNavigationTypeLinkOther -1

@implementation ExternalUrlIntercept

- (void)pluginInitialize {
    allowedNavigationUrls = [[NSMutableDictionary alloc] init];
}

+ (BOOL)filterYoutubeNavigation:(NSURLRequest*)request navigationType:(CDVWebViewNavigationType)navigationType {
    NSError *error = NULL;
    NSRegularExpression* youtubeRegex = [NSRegularExpression regularExpressionWithPattern:@"(?:https?://)?(?:www.)?youtu.?be(?:.com)?/?.*(?:watch|embed)?(?:.*v=|v/|/)([\\w\\-_]+)&?" options:NSRegularExpressionCaseInsensitive error:&error];

    NSString* absoluteUrl = [request.URL absoluteString];
    NSUInteger matches = [youtubeRegex numberOfMatchesInString:absoluteUrl options:0 range:NSMakeRange(0, [absoluteUrl length])];

    BOOL isMainNavigation = [[request.mainDocumentURL absoluteString] isEqualToString:absoluteUrl];
    if (isMainNavigation && matches != 0) {
        return false;
    }

    if(!isMainNavigation && navigationType == CDVWebViewNavigationTypeLinkClicked && matches != 0) {
        return false;
    }

    return true;
}

- (BOOL)shouldOverrideLoadWithRequest:(NSURLRequest*)request navigationType:(CDVWebViewNavigationType)navigationType {
    if (self.callbackId == nil) {
        return true;
    }

    NSString* url = [request.URL absoluteString];
    if ([allowedNavigationUrls objectForKey:url] != nil) {
        [allowedNavigationUrls removeObjectForKey:url];
        return true;
    }

    if ([[self class] filterYoutubeNavigation:request navigationType:navigationType] == false) {
        NSDictionary* message = @{@"action":@"blockedNavigation",
                                  @"url":url};

        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK messageAsDictionary:message];
        [pluginResult setKeepCallback:@TRUE];

        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];

        return false;
    } else {
        return true;
    }
}

- (void)initializeCallback:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;

    NSDictionary* message = @{@"action":@"callbackInitialized"};

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK messageAsDictionary:message];
    [pluginResult setKeepCallback:@TRUE];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

- (void)allowNavigationToUrl:(CDVInvokedUrlCommand *)command {
    NSString* url = command.arguments[0];
    [allowedNavigationUrls setValue:@TRUE forKey:url];

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end

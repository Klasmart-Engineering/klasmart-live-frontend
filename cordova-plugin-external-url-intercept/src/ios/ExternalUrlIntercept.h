
#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVInvokedUrlCommand.h>

#define CDVWebViewNavigationType int

typedef NS_ENUM(NSInteger, CDVIntentAndNavigationFilterValue) {
    CDVIntentAndNavigationFilterValueIntentAllowed,
    CDVIntentAndNavigationFilterValueNavigationAllowed,
    CDVIntentAndNavigationFilterValueNoneAllowed
};

@interface ExternalUrlIntercept : CDVPlugin {
    NSMutableDictionary* allowedNavigationUrls;
}

@property (nonatomic, strong) NSString* callbackId;

- (void)initializeCallback:(CDVInvokedUrlCommand *)command;
- (void)allowNavigationToUrl:(CDVInvokedUrlCommand *)command;

+ (BOOL)filterYoutubeNavigation:(NSURLRequest*)request navigationType:(CDVWebViewNavigationType)navigationType;

@end

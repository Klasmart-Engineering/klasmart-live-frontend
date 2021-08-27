package com.kidsloop.cordova.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PermissionHelper;
import org.apache.cordova.PluginResult;
import org.apache.cordova.LOG;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;

public class ExternalUrlIntercept extends CordovaPlugin {
    static String TAG = "ExternalUrlIntercept";

    CallbackContext callbackContext = null;

    private ArrayList<String> allowedNavigationUrls = new ArrayList<String>();

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("initializeCallback")) {
            return this.initializeCallback(args, callbackContext);
	    } else if (action.equals("addAllowedNavigationUrl")) {
            return this.addAllowedNavigationUrl(args, callbackContext);
        }

        return false;
    }

    // false: block the navigation
    // true: allow the navigation (if no other plugin return false)
    // null: default behaviour
    public Boolean shouldAllowNavigation(String url) {
        LOG.d(TAG, "shouldAllowNavigation -> " + url);

        if (url.startsWith("file:///android_asset/www/")) {
            return null;
        }

        // NOTE: The url is allowed
        if (allowedNavigationUrls.contains(url)) {
            allowedNavigationUrls.remove(url);
            return null;
        }

        if (callbackContext != null) {
            try {
                blockedNavigationCallback(url);
            } catch(JSONException exc) {
                LOG.e(TAG, exc.getMessage());
            }

            return false;
        }

        return null;
    }

    // false: allow the navigation
    // true: block the navigation
    public boolean onOverrideUrlLoading(String url) {
        LOG.d(TAG, "onOverrideUrlLoading -> " + url);

        if (url.startsWith("file:///android_asset/www/")) {
            return false;
        }

        // NOTE: The url is allowed
        if (allowedNavigationUrls.contains(url)) {
            allowedNavigationUrls.remove(url);
            return false;
        }

        if (callbackContext != null) {
            try {
                blockedNavigationCallback(url);
            } catch(JSONException exc) {
                LOG.e(TAG, exc.getMessage());
            }

            return true;
        }

        return false;
    }

    public boolean initializeCallback(JSONArray args, CallbackContext callbackContext) throws JSONException  {
        this.callbackContext = callbackContext;

        JSONObject jsFunctionCall = new JSONObject();
	    jsFunctionCall.put("action", "callbackInitialized");
	    
        PluginResult result = new PluginResult(PluginResult.Status.OK, jsFunctionCall);
	
        result.setKeepCallback(true);

	    callbackContext.sendPluginResult(result);

        return true;
    }

    public boolean addAllowedNavigationUrl(JSONArray args, CallbackContext callbackContext) {
        String url = args.optString(0);

        if (!allowedNavigationUrls.contains(url)) {
            allowedNavigationUrls.add(url);
        }

        callbackContext.success();
        return true;
    }

    public void blockedNavigationCallback(String url) throws JSONException {
        JSONObject jsFunctionCall = new JSONObject();
	    jsFunctionCall.put("action", "blockedNavigation");
        jsFunctionCall.put("url", url);

        PluginResult result = new PluginResult(PluginResult.Status.OK, jsFunctionCall);

        result.setKeepCallback(true);

        callbackContext.sendPluginResult(result);
    }
}

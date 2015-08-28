//
//  AppDelegate.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 22/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import AppKit
import WebKit
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
  
  let SEGMENTED_CONTROL_BACK: Int = 0;
  let SEGMENTED_CONTROL_FORWARD: Int = 1;

  @IBOutlet var window: NSWindow!
  @IBOutlet var contentView: NSView!
  @IBOutlet var webview: WebView!
  
  @IBOutlet var historyNavigation: NSSegmentedControl!
  @IBOutlet weak var search: NSSearchFieldCell!
  
  var jsBridge: JSBridge!
  var jsBridgeExports: JSBridgeExports!
  
  override func awakeFromNib() {
	  self.window.titleVisibility = NSWindowTitleVisibility.Hidden;
    self.window.appearance = NSAppearance(named: NSAppearanceNameVibrantDark);
    self.window.movableByWindowBackground = true;
    
    self.window.styleMask |= NSFullSizeContentViewWindowMask;
    
    self.window.makeKeyAndOrderFront(self.window);
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    initApp(self);

    self.search.sendsWholeSearchString = true;
  }

  func applicationWillTerminate(aNotification: NSNotification) {
    // Insert code here to tear down your application
  }
  
  func callJSBridgeEvent(eventName: String)
  {
    do {
      if (self.jsBridge != nil && self.jsBridgeExports != nil) {
        try self.jsBridgeExports.emit(eventName);
      }
    } catch JSBridgeError.NoEventHandler {
      debugPrint("JSBridge: No event handler for '" + eventName + "' event!");
    } catch {
      debugPrint("JSBridge: error occured!");
    }
  }

  func callJSBridgeEvent(eventName: String, data: NSDictionary)
  {
    do {
      if (self.jsBridge != nil && self.jsBridgeExports != nil) {
	      try self.jsBridgeExports.emit(eventName, data: data);
      }
    } catch JSBridgeError.NoEventHandler {
      debugPrint("JSBridge: No event handler for '" + eventName + "' event!");
    } catch {
      debugPrint("JSBridge: error occured!");
    }
  }
  
  @IBAction func processHistoryNavigation(sender: AnyObject) {
    if (self.historyNavigation.isSelectedForSegment(self.SEGMENTED_CONTROL_BACK)) {
      self.callJSBridgeEvent("history-back");
    }
    if (self.historyNavigation.isSelectedForSegment(self.SEGMENTED_CONTROL_FORWARD)) {
      self.callJSBridgeEvent("history-forward");
    }
  }

  @IBAction func processSearch(sender: AnyObject) {
    let data = NSDictionary(objects: [self.search.stringValue], forKeys: ["keyword"]);
    self.callJSBridgeEvent("search-input", data: data);
  }
}
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

  @IBOutlet var window: NSWindow!
  @IBOutlet var contentView: NSView!
  @IBOutlet var webview: WebView!
  
  @IBOutlet var historyNavigation: NSSegmentedControl!
  @IBOutlet var search: NSSearchFieldCell!
  
  var jsBridge: JSBridge!
  var jsBridgeExports: JSBridgeExports!
  
  override func awakeFromNib() {
	  self.window.titleVisibility = NSWindowTitleVisibility.Hidden;
  	self.window.appearance = NSAppearance(named: NSAppearanceNameVibrantDark);
  }
  
  func applicationDidFinishLaunching(aNotification: NSNotification) {
    initApp(self);
  }

  func applicationWillTerminate(aNotification: NSNotification) {
    // Insert code here to tear down your application
  }

  @IBAction func processHistoryNavigation(sender: AnyObject) {
    if (sender.isSelectedForSegment(0)) {
      do {
        try self.jsBridgeExports.emit("history-back");
      } catch JSBridgeError.NoEventHandler {
        debugPrint("No Event Handler for `history-back` event!");
      } catch {
        debugPrint("Error occured!")
      }
    }
    if (sender.isSelectedForSegment(1)) {
    	do {
      	try self.jsBridgeExports.emit("history-forward");
    	} catch JSBridgeError.NoEventHandler {
        debugPrint("No Event Handler for `history-forward` event!");
      } catch {
        debugPrint("Error occured!")
      }
    }
  }

  @IBAction func processSearch(sender: AnyObject) {
    let data = NSMutableDictionary();
    data.setValue(sender.value, forKey: "keyword");
    
    do {
      try self.jsBridgeExports.emit("search-keypress", data: data);
    } catch JSBridgeError.NoEventHandler {
      debugPrint("No Event Handler for `search-keypress` event!");
    } catch {
      debugPrint("Error occured!")
    }
  }
}
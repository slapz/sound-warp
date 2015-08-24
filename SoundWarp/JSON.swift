//
//  JSON.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 8/24/15.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

class JSON: JSValue {
  
  var object: NSMutableDictionary!
  
  init(object: NSMutableDictionary) {
    super.init();
    
    self.object = object;
  }
	
  override func toString() -> String! {
    var stringValue: String = "";
    var value: AnyObject;
    if ((self.object) != nil) {
      for key in self.object {
        stringValue += "\"" + key + "\": " + self.object[key].toString() + ",";
        
      }
    } else {
      stringValue = "{}";
    }
    
    return stringValue;
  }
  
}
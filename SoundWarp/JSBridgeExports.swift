//
//  JSBridgeExports.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation

class JSBridgeExports : NSObject {
  
  func multiply(number: Float, by: Float) -> Float
  {
    return number * by;
  }
  
  override class func webScriptNameForSelector(aSelector: Selector) -> String!  {
    switch aSelector {
    case Selector("multiply:by:"):
      return "multiply"
    default:
      return nil
    }
  }
  
  override class func isSelectorExcludedFromWebScript(selector: Selector) -> Bool {
    switch selector {
    case Selector("multiply:by:"): return false
    default: return true
    }
  }
}
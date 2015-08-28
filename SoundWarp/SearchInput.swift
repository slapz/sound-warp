//
//  SearchInput.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 8/28/15.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import AppKit

class SearchInput: NSSearchField {
  
  override func awakeFromNib() {
    self.appearance = NSAppearance(named: NSAppearanceNameVibrantDark);
  }
  
}
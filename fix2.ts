import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// The main Admin Panel motion.div starts around line 375
// Ends at line 1869.
// The receipt modal:
// <motion.div key="receipt-modal"...
// <motion.div initial={{ scale: 0.95...
// we need to fix their closing tags.

// Let's just fix it by string replacement:
code = code.replace(
`              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}`, 
`              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`);

// Fix the MenuContent ending:
code = code.replace(
`        <span className="text-xs">تجهيزات ونسب المنصة</span>
      </button>
    </motion.div>
  );
}`,
`        <span className="text-xs">تجهيزات ونسب المنصة</span>
      </button>
    </div>
  );
}`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);

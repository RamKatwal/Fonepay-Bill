import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Sale } from '@/types/sale';
import { Merchant } from '@/types/merchant';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import {
  generateBillImageDataUrl,
  downloadBillImage,
  shareBillToWhatsApp,
  shareBillViaSystem,
  copyBillTextToClipboard,
  formatBillText,
  BillImageResult,
} from '@/utils/billImageGenerator';

interface ShareBillModalProps {
  visible: boolean;
  onClose: () => void;
  sale: Sale;
  merchant: Merchant;
  isOfficial?: boolean;
}

export function ShareBillModal({
  visible,
  onClose,
  sale,
  merchant,
  isOfficial = true,
}: ShareBillModalProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [imageResult, setImageResult] = useState<BillImageResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Generate the bill image when modal opens or sale changes
  useEffect(() => {
    if (visible && sale) {
      let isMounted = true;
      setIsGenerating(true);
      setFeedback(null);

      generateBillImageDataUrl(sale, merchant, isOfficial)
        .then((result) => {
          if (isMounted) {
            setImageResult(result);
            setIsGenerating(false);
          }
        })
        .catch((err) => {
          console.error('Error generating bill image:', err);
          if (isMounted) {
            setIsGenerating(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      setImageResult(null);
      setFeedback(null);
    }
  }, [visible, sale, merchant, isOfficial]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleDownload = () => {
    if (!imageResult) return;
    const success = downloadBillImage(imageResult.dataUrl, sale.invoiceNumber);
    if (success) {
      showFeedback(`✓ Downloaded ${imageResult.filename}`);
    } else {
      showFeedback('Download initiated. Check your browser downloads.');
    }
  };

  const handleWhatsApp = async () => {
    setIsSharing(true);
    try {
      const res = await shareBillToWhatsApp(sale, merchant, imageResult?.dataUrl);
      if (res.method === 'web-share-image') {
        showFeedback('✓ Opened sharing sheet for WhatsApp');
      } else {
        showFeedback('✓ Opening WhatsApp with bill details...');
      }
    } catch {
      showFeedback('Could not open WhatsApp.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleSystemShare = async () => {
    setIsSharing(true);
    try {
      const success = await shareBillViaSystem(sale, merchant, imageResult?.dataUrl);
      if (success) {
        showFeedback('✓ Shared successfully');
      }
    } catch {
      showFeedback('Share cancelled');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyText = async () => {
    const success = await copyBillTextToClipboard(sale, merchant);
    if (success) {
      showFeedback('✓ Invoice summary copied to clipboard');
    } else {
      showFeedback('Could not copy text.');
    }
  };

  const formattedText = formatBillText(sale, merchant);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Modal Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.headerTitle}>Share & Export Bill</Text>
                  <Text style={styles.headerSubtitle}>Invoice #{sale.invoiceNumber}</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeBtn}>
                  <Icon name="close" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Feedback Banner */}
              {feedback && (
                <View style={styles.feedbackBanner}>
                  <Icon name="checkmark-circle" size={16} color={Colors.success} />
                  <Text style={styles.feedbackText}>{feedback}</Text>
                </View>
              )}

              {/* Format Switcher Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'image' && styles.tabActive]}
                  onPress={() => setActiveTab('image')}>
                  <Icon
                    name="image-outline"
                    size={16}
                    color={activeTab === 'image' ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'image' && styles.tabTextActive,
                    ]}>
                    Image Preview (PNG)
                  </Text>
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>HD</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, activeTab === 'text' && styles.tabActive]}
                  onPress={() => setActiveTab('text')}>
                  <Icon
                    name="text-outline"
                    size={16}
                    color={activeTab === 'text' ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'text' && styles.tabTextActive,
                    ]}>
                    Text Summary
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Preview Body */}
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}>
                {activeTab === 'image' ? (
                  <View style={styles.imagePreviewWrap}>
                    {isGenerating ? (
                      <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Generating official receipt image...</Text>
                        <Text style={styles.loadingSubtext}>Rendering crisp 2x Retina tax invoice</Text>
                      </View>
                    ) : imageResult ? (
                      <View style={styles.imageCard}>
                        <View style={styles.imageHeaderBar}>
                          <View style={styles.imageFormatTag}>
                            <View style={styles.pulseDot} />
                            <Text style={styles.imageFormatTagText}>PNG Image Format</Text>
                          </View>
                          <Text style={styles.imageResolutionText}>
                            High-Res • 1440px
                          </Text>
                        </View>

                        {/* Image element */}
                        <Image
                          source={{ uri: imageResult.dataUrl }}
                          style={styles.billImage}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View style={styles.errorBox}>
                        <Icon name="alert-circle-outline" size={32} color={Colors.failed} />
                        <Text style={styles.errorText}>Unable to render invoice image</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.textPreviewWrap}>
                    <View style={styles.textContainer}>
                      <Text style={styles.monospaceText}>{formattedText}</Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Action Buttons Footer */}
              <View style={styles.actionsFooter}>
                {/* Primary WhatsApp Action */}
                <TouchableOpacity
                  style={styles.whatsappBtn}
                  activeOpacity={0.88}
                  onPress={handleWhatsApp}
                  disabled={isSharing}>
                  <View style={styles.btnContentRow}>
                    <Icon name="logo-whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.whatsappBtnText}>
                      Share on WhatsApp
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Secondary Row: Download & System Share */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.downloadBtn]}
                    activeOpacity={0.88}
                    onPress={handleDownload}
                    disabled={!imageResult || isGenerating}>
                    <Icon name="download-outline" size={18} color={Colors.primary} />
                    <Text style={styles.actionBtnText}>Download Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.systemShareBtn]}
                    activeOpacity={0.88}
                    onPress={handleSystemShare}
                    disabled={isSharing}>
                    <Icon name="share-social-outline" size={18} color={Colors.text} />
                    <Text style={[styles.actionBtnText, { color: Colors.text }]}>Share via...</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.copyBtn]}
                    activeOpacity={0.88}
                    onPress={handleCopyText}>
                    <Icon name="copy-outline" size={18} color={Colors.textSecondary} />
                    <Text style={[styles.actionBtnText, { color: Colors.textSecondary }]}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSubtle,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.successSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  feedbackText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.successText,
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.surfaceSubtle,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  tabBadge: {
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: Spacing.md,
  },
  imagePreviewWrap: {
    alignItems: 'center',
  },
  loadingBox: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  loadingSubtext: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  errorBox: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: Typography.size.sm,
    color: Colors.failed,
  },
  imageCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imageHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  imageFormatTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  imageFormatTagText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  imageResolutionText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  billImage: {
    width: '100%',
    height: 480,
    backgroundColor: '#FFFFFF',
  },
  textPreviewWrap: {
    padding: Spacing.xs,
  },
  textContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  monospaceText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: Typography.size.xs,
    lineHeight: 18,
    color: Colors.text,
  },
  actionsFooter: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  whatsappBtn: {
    backgroundColor: '#25D366', // WhatsApp Green
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whatsappBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    backgroundColor: Colors.surface,
  },
  downloadBtn: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  systemShareBtn: {
    borderColor: Colors.border,
  },
  copyBtn: {
    flex: 0.7,
    borderColor: Colors.border,
  },
  actionBtnText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
});

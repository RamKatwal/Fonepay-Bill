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
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { shadows } from '@/constants/shadows';
import { makeStyles, useTheme } from '@/theme';
import { Icon } from '@/components/ui/Icon';
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
  const styles = useStyles();
  const c = useTheme();
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [imageResult, setImageResult] = useState<BillImageResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.headerTitle}>Share & export bill</Text>
                  <Text style={styles.headerSubtitle}>Invoice #{sale.invoiceNumber}</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeBtn}>
                  <Icon name="close" size={20} color={c.text.secondary} />
                </TouchableOpacity>
              </View>

              {feedback && (
                <View style={styles.feedbackBanner}>
                  <Icon name="checkmark-circle" size={16} color={c.status.success} />
                  <Text style={styles.feedbackText}>{feedback}</Text>
                </View>
              )}

              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'image' && styles.tabActive]}
                  onPress={() => setActiveTab('image')}>
                  <Icon
                    name="image-outline"
                    size={16}
                    color={activeTab === 'image' ? c.text.primary : c.text.secondary}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'image' && styles.tabTextActive,
                    ]}>
                    Image (PNG)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, activeTab === 'text' && styles.tabActive]}
                  onPress={() => setActiveTab('text')}>
                  <Icon
                    name="text-outline"
                    size={16}
                    color={activeTab === 'text' ? c.text.primary : c.text.secondary}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'text' && styles.tabTextActive,
                    ]}>
                    Text summary
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}>
                {activeTab === 'image' ? (
                  <View style={styles.imagePreviewWrap}>
                    {isGenerating ? (
                      <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={c.text.secondary} />
                        <Text style={styles.loadingText}>Generating receipt image…</Text>
                        <Text style={styles.loadingSubtext}>Rendering 2x tax invoice</Text>
                      </View>
                    ) : imageResult ? (
                      <View style={styles.imageCard}>
                        <View style={styles.imageHeaderBar}>
                          <Text style={styles.imageFormatTagText}>PNG image</Text>
                          <Text style={styles.imageResolutionText}>1440px</Text>
                        </View>
                        <Image
                          source={{ uri: imageResult.dataUrl }}
                          style={styles.billImage}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View style={styles.errorBox}>
                        <Icon name="alert-circle-outline" size={32} color={c.status.error} />
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

              <View style={styles.actionsFooter}>
                <TouchableOpacity
                  style={styles.whatsappBtn}
                  activeOpacity={0.88}
                  onPress={handleWhatsApp}
                  disabled={isSharing}>
                  <View style={styles.btnContentRow}>
                    <Icon name="logo-whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.whatsappBtnText}>Share on WhatsApp</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.88}
                    onPress={handleDownload}
                    disabled={!imageResult || isGenerating}>
                    <Icon name="download-outline" size={18} color={c.text.primary} />
                    <Text style={styles.actionBtnText}>Download</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.88}
                    onPress={handleSystemShare}
                    disabled={isSharing}>
                    <Icon name="share-social-outline" size={18} color={c.text.primary} />
                    <Text style={styles.actionBtnText}>Share via…</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.copyBtn]}
                    activeOpacity={0.88}
                    onPress={handleCopyText}>
                    <Icon name="copy-outline" size={18} color={c.text.secondary} />
                    <Text style={[styles.actionBtnText, { color: c.text.secondary }]}>Copy</Text>
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

const useStyles = makeStyles((t) => ({
  overlay: {
    flex: 1,
    backgroundColor: t.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    backgroundColor: t.background.elevated,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    flexDirection: 'column',
    ...shadows.elevated,
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
    borderBottomColor: t.border.subtle,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.sectionTitle,
    color: t.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.size.xs,
    color: t.text.muted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: t.background.subtle,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: t.status.successBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  feedbackText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: t.status.success,
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: t.background.subtle,
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
    backgroundColor: t.background.surface,
    borderColor: t.border.strong,
  },
  tabText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: t.text.secondary,
  },
  tabTextActive: {
    fontWeight: Typography.weight.bold,
    color: t.text.primary,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: t.background.subtle,
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
    color: t.text.primary,
  },
  loadingSubtext: {
    fontSize: Typography.size.xs,
    color: t.text.muted,
  },
  errorBox: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: Typography.size.sm,
    color: t.status.error,
  },
  imageCard: {
    width: '100%',
    backgroundColor: t.background.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: t.border.subtle,
    overflow: 'hidden',
  },
  imageHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: t.background.subtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: t.border.subtle,
  },
  imageFormatTagText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
    color: t.text.secondary,
    letterSpacing: 0.3,
  },
  imageResolutionText: {
    fontSize: 11,
    color: t.text.muted,
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
    backgroundColor: t.background.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: t.border.subtle,
  },
  monospaceText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: Typography.size.xs,
    lineHeight: 18,
    color: t.text.primary,
  },
  actionsFooter: {
    padding: Spacing.md,
    backgroundColor: t.background.surface,
    borderTopWidth: 1,
    borderTopColor: t.border.subtle,
    gap: Spacing.sm,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: t.border.default,
    backgroundColor: t.background.surface,
  },
  copyBtn: {
    flex: 0.7,
  },
  actionBtnText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: t.text.primary,
  },
}));
